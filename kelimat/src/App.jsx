import BottomNav from './components/BottomNav.jsx';
import SpeechHelp from './components/SpeechHelp.jsx';
import Home from './pages/Home.jsx';
import Learn from './pages/Learn.jsx';
import Say from './pages/Say.jsx';
import Me from './pages/Me.jsx';
import { useRoute } from './lib/router.js';
import { useProgress } from './lib/useProgress.jsx';

export default function App() {
  const { state } = useProgress();
  const [page = '', param] = useRoute();
  const inSession = page === 'learn' && !!param;

  let view;
  if (page === 'learn') view = <Learn key={state.mode} scenarioId={param} />;
  else if (page === 'say') view = <Say scenarioId={param} />;
  else if (page === 'me') view = <Me section={param} />;
  else view = <Home />;

  return (
    <div className="min-h-dvh">
      <main className={`max-w-md mx-auto px-4 pt-[max(env(safe-area-inset-top),0.75rem)] ${inSession ? 'pb-8' : 'pb-28'}`}>{view}</main>
      <SpeechHelp />
      {!inSession && <BottomNav active={['learn', 'say', 'me'].includes(page) ? page : ''} />}
    </div>
  );
}
