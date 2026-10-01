import { useState, useRef, useEffect } from 'react';
import { Mic, Square, ArrowLeft, Sparkles, Circle, Brain, Timer, Activity, Video } from 'lucide-react';
import type { AppState, Topic, ChallengeResult } from './types';
import { generateRandomTopic } from './mockData';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [topic, setTopic] = useState<Topic | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isGettingFeedback, setIsGettingFeedback] = useState<boolean>(false);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      
      // Stop recording if active
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
      }
      clearTimer();
      setAppState('landing');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mediaRecorder, mediaStream]);

  // Wrapper for changing state to handle history
  const navigateTo = (newState: AppState) => {
    if (newState !== 'landing' && appState === 'landing') {
      window.history.pushState({ page: newState }, '');
    } else if (newState === 'landing' && appState !== 'landing') {
      // If we're manually going to landing, we should replace or just go back, 
      // but to be safe and avoid history bloat we can just let it be or use pushState.
      // Easiest is to just pushState if we are not using a real router.
      window.history.pushState({ page: 'landing' }, '');
    }
    setAppState(newState);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  useEffect(() => {
    if (appState === 'speaking' && videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [appState, mediaStream]);

  const handleGenerate = async () => {
    navigateTo('generating');
    const newTopic = await generateRandomTopic();
    setTopic(newTopic);
    setAppState('topic_reveal');
  };

  const startChallenge = async (withVideo: boolean) => {
    try {
      setUseVideo(withVideo);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo ? { width: 1280, height: 720 } : false
      });
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: withVideo ? 'video/webm' : 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const actualDuration = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : 60 - timeLeft;

        if (topic) {
          const newResult: ChallengeResult = {
            topic,
            duration: actualDuration,
            audioBlob,
            date: new Date()
          };
          setResult(newResult);
          
          // Trigger feedback asynchronously
          setIsGettingFeedback(true);
          import('./mockData').then(({ getAudioFeedback }) => {
            getAudioFeedback(audioBlob, topic.title)
              .then((feedback) => {
                setResult(prev => prev ? { ...prev, feedback } : prev);
              })
              .catch(err => {
                console.error("Feedback error", err);
              })
              .finally(() => {
                setIsGettingFeedback(false);
              });
          });
        }
        setAppState('result');
        stream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      };

      setMediaRecorder(recorder);
      recorder.start();

      startTimeRef.current = Date.now();
      setTimeLeft(60);
      setAppState('speaking');

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            recorder.stop();
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Media access is required for the speaking challenge.");
    }
  };

  const stopChallenge = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    clearTimer();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Hard': return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* Landing */}
      {appState === 'landing' && (
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full space-y-32 py-20">
            {/* Hero Section */}
            <div className="space-y-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
                <Circle className="w-2 h-2 fill-emerald-400" />
                Practice spontaneous speaking with AI
              </div>

              <h1 className="text-7xl font-light tracking-tight">
                Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Cadence</span>
              </h1>

              <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                Improve your communication skills. Get a random topic, record yourself speaking for 60 seconds, and receive instant AI-powered feedback on your delivery and content.
              </p>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleGenerate}
                  className="group relative px-10 py-5 bg-white text-black text-lg font-medium rounded-full hover:bg-white/90 transition-all duration-200 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Mic className="w-5 h-5" />
                    Start Speaking Practice
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>

            {/* How it Works */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-light">How it Works</h2>
                <p className="text-white/40">Three simple steps to better speaking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-light">1</div>
                  <h3 className="text-xl font-medium">Get a Topic</h3>
                  <p className="text-white/50 leading-relaxed">Receive a randomized topic ranging from science to philosophy. Take your time to research the suggested talking points.</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-light">2</div>
                  <h3 className="text-xl font-medium">Record 60 Seconds</h3>
                  <p className="text-white/50 leading-relaxed">Present your thoughts. You only have one minute, forcing you to be concise, clear, and focused on the key message.</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-24 h-24" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-light border border-emerald-500/30">3</div>
                  <h3 className="text-xl font-medium">AI Feedback</h3>
                  <p className="text-white/50 leading-relaxed">Get instant, personalized feedback on your strengths and areas for improvement, powered by advanced AI analysis.</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-light">Everything You Need</h2>
                <p className="text-white/40">Tools to build your confidence</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Video className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Audio & Video Modes</h4>
                    <p className="text-sm text-white/50">Practice just your voice, or record video to review your body language and eye contact.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Activity className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Detailed Analysis</h4>
                    <p className="text-sm text-white/50">Receive a transcription of your speech and actionable advice on how to improve.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Brain className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Curated Topics</h4>
                    <p className="text-sm text-white/50">Hundreds of topics across various difficulties designed to challenge your critical thinking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <div className="p-3 rounded-xl bg-white/5">
                    <Timer className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Time Pressure</h4>
                    <p className="text-sm text-white/50">The strict 60-second limit helps eliminate filler words and teaches you to get to the point.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO / FAQ Section */}
            <div className="space-y-12 pt-10 border-t border-white/10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-light">Frequently Asked Questions</h2>
                <p className="text-white/40">Everything you need to know about impromptu speaking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pb-10">
                <article className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-medium text-emerald-400">What is a random topic generator for speech?</h3>
                  <p className="text-white/50 text-sm leading-relaxed">A random topic generator is an essential tool for impromptu speaking practice. It provides you with unexpected subjects, forcing you to think on your feet, organize your thoughts quickly, and deliver a coherent 60-second presentation without prior preparation.</p>
                </article>

                <article className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-medium text-emerald-400">How can I improve my communication skills?</h3>
                  <p className="text-white/50 text-sm leading-relaxed">The best way to overcome public speaking anxiety and improve verbal communication is through consistent practice. By simulating time pressure with our built-in timer and utilizing AI feedback, you learn to eliminate filler words, speak with confidence, and structure your arguments effectively.</p>
                </article>

                <article className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-medium text-emerald-400">Why practice impromptu speaking?</h3>
                  <p className="text-white/50 text-sm leading-relaxed">Whether you are preparing for a job interview, leading a team meeting, or participating in a debate, the ability to speak spontaneously is a high-value skill. Regular practice enhances your cognitive flexibility and boosts your everyday conversational confidence.</p>
                </article>

                <article className="space-y-3 p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="text-lg font-medium text-emerald-400">How does the AI speech analysis work?</h3>
                  <p className="text-white/50 text-sm leading-relaxed">Once you record your 60-second speech, our advanced AI processes the transcript. It evaluates your vocabulary, delivery, and structure, providing you with a personalized score, highlighted strengths, and actionable areas for improvement.</p>
                </article>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Generating */}
      {appState === 'generating' && (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center gap-8 w-full max-w-md px-6">

            {/* Sliding topics */}
            <div className="relative h-12 w-full overflow-hidden">
              {/* Gradient masks */}
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

              {/* Sliding text */}
              <div className="absolute inset-0 flex items-center">
                <div className="flex gap-12 animate-[slide_20s_linear_infinite] whitespace-nowrap">
                  <span className="text-white/30">Quantum Entanglement</span>
                  <span className="text-white/30">The Fall of Rome</span>
                  <span className="text-white/30">Bioluminescence</span>
                  <span className="text-white/30">The Fermi Paradox</span>
                  <span className="text-white/30">Game Theory</span>
                  <span className="text-white/30">Neural Networks</span>
                  <span className="text-white/30">The Placebo Effect</span>
                  <span className="text-white/30">Dark Matter</span>
                  {/* Duplicate for seamless loop */}
                  <span className="text-white/30">Quantum Entanglement</span>
                  <span className="text-white/30">The Fall of Rome</span>
                  <span className="text-white/30">Bioluminescence</span>
                  <span className="text-white/30">The Fermi Paradox</span>
                  <span className="text-white/30">Game Theory</span>
                  <span className="text-white/30">Neural Networks</span>
                  <span className="text-white/30">The Placebo Effect</span>
                  <span className="text-white/30">Dark Matter</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-white/40">Generating topic...</p>
          </div>
        </div>
      )}

      {/* Topic Reveal */}
      {appState === 'topic_reveal' && topic && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-8">

            {/* Back */}
            <button
              onClick={() => {
                window.history.back(); // This will trigger popstate which handles the cleanup
              }}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Topic */}
            <div className="space-y-6">

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                  {topic.category}
                </span>
                {topic.subcategory && (
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
                    {topic.subcategory}
                  </span>
                )}
                <span className={`px-2 py-1 rounded border text-xs ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-light leading-tight">
                {topic.title}
              </h2>

              {/* Description */}
              <p className="text-lg text-white/60 leading-relaxed">
                {topic.description}
              </p>

              {/* Research areas */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Things to research
                </p>
                <ul className="space-y-2">
                  {topic.suggestedResearchAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/60">
                      <span className="text-white/20 mt-1">—</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => startChallenge(false)}
                className="flex-1 px-6 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all active:scale-95"
              >
                Start Recording
              </button>
              <button
                onClick={() => startChallenge(true)}
                className="px-6 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all active:scale-95"
              >
                Record with Video
              </button>
            </div>

            <p className="text-center text-sm text-white/30">
              Take your time. No timer until you start recording.
            </p>

          </div>
        </div>
      )}

      {/* Speaking */}
      {appState === 'speaking' && topic && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full space-y-12">

            {/* Context */}
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-wider text-white/40">
                Now speaking about
              </p>
              <h3 className="text-2xl font-light text-white/80">
                {topic.title}
              </h3>
            </div>

            {/* Timer / Video */}
            {useVideo ? (
              <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-black border border-white/10">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Timer overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-mono text-xl tabular-nums">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer ring */}
                  <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-white/10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-white"
                      strokeDasharray="282.74"
                      strokeDashoffset={282.74 - (282.74 * timeLeft) / 60}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>

                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-mono text-6xl font-light tabular-nums">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs text-white/40">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      Recording
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stop button */}
            <div className="flex justify-center">
              <button
                onClick={stopChallenge}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all active:scale-95"
              >
                <Square className="inline w-3 h-3 mr-2 fill-current" />
                Stop Early
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Results */}
      {appState === 'result' && result && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-8">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-light">Complete</h2>
              <p className="text-white/40">
                You spoke about <span className="text-white/80">{result.topic.title}</span> for {result.duration} seconds
              </p>
            </div>

            {/* Playback */}
            <div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Your recording</span>
                <span className="font-mono text-white/40">{result.duration}s</span>
              </div>

              {audioUrl && useVideo && (
                <video
                  controls
                  src={audioUrl}
                  className="w-full rounded-lg bg-black"
                >
                  Your browser does not support video playback.
                </video>
              )}

              {audioUrl && !useVideo && (
                <audio
                  controls
                  src={audioUrl}
                  className="w-full"
                >
                  Your browser does not support audio playback.
                </audio>
              )}

              <div className="pt-4 border-t border-white/10">
                {isGettingFeedback ? (
                   <div className="flex flex-col items-center justify-center p-6 space-y-3">
                     <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                     <p className="text-white/40 text-sm animate-pulse">AI is analyzing your speech...</p>
                   </div>
                ) : result.feedback ? (
                   <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-white/10 pb-3">
                       <h4 className="font-medium text-white/80">AI Feedback</h4>
                       <div className="flex items-center gap-2">
                         <span className="text-xs text-white/40 uppercase tracking-widest">Score</span>
                         <span className="text-xl font-light text-emerald-400">{result.feedback.score}/100</span>
                       </div>
                     </div>
                     <div>
                       <h5 className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Transcript</h5>
                       <p className="text-sm text-white/60 italic mb-4 p-3 bg-black/20 rounded-lg border border-white/5">"{result.feedback.transcript}"</p>
                       <p className="text-white/80 text-sm leading-relaxed">{result.feedback.overall}</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                       <div>
                         <h5 className="text-emerald-400/80 text-sm font-medium mb-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                           Strengths
                         </h5>
                         <ul className="space-y-2">
                           {result.feedback.strengths.map((s, i) => (
                             <li key={i} className="text-white/60 text-xs leading-relaxed">{s}</li>
                           ))}
                         </ul>
                       </div>
                       <div>
                         <h5 className="text-amber-400/80 text-sm font-medium mb-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                           To Improve
                         </h5>
                         <ul className="space-y-2">
                           {result.feedback.improvements.map((s, i) => (
                             <li key={i} className="text-white/60 text-xs leading-relaxed">{s}</li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   </div>
                ) : (
                  <p className="text-sm text-white/40 text-center py-4">
                    🎯 Listen to your recording and self-evaluate.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={handleGenerate}
                className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all active:scale-95"
              >
                Generate Another Topic
              </button>
              <button
                onClick={() => {
                  window.history.back();
                }}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all active:scale-95"
              >
                Back to Home
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
