import { useEffect } from 'react';
import { KantuProvider, useKantu } from './state/store';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { LogPick } from './screens/LogPick';
import { LogForm } from './screens/LogForm';
import { Trends } from './screens/Trends';
import { History } from './screens/History';
import { Insights } from './screens/Insights';
import { Summary } from './screens/Summary';
import { Settings } from './screens/Settings';
import { Header, screenTitle } from './components/Header';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { dictionaries } from './i18n/dict';

function AppShell() {
  const { screen, lang, dark, setLang, go, logType, toast, name } = useKantu();
  const t = dictionaries[lang];
  const anchorLabel = name.trim() ? name.trim().toUpperCase() : t.kicker;

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (screen === 'onb') {
    return (
      <div className="kw-app-page">
        <div className="kw-app-shell">
          <Onboarding />
        </div>
      </div>
    );
  }

  let body = null;
  if (screen === 'home') body = <Dashboard />;
  else if (screen === 'log') body = logType ? <LogForm /> : <LogPick />;
  else if (screen === 'trends') body = <Trends />;
  else if (screen === 'hist') body = <History />;
  else if (screen === 'insights') body = <Insights />;
  else if (screen === 'settings') body = <Settings />;
  else if (screen === 'summary') body = <Summary />;

  return (
    <div className="kw-app-page">
      <div className="kw-app-shell">
        <Header kicker={anchorLabel} title={screenTitle(lang, screen)} lang={lang} onSetLang={setLang} onSettings={() => go('settings')} onHome={() => go('home')} />
        <div className="kw-scroll">{body}</div>
        <Toast message={toast} />
        <TabBar
          screen={screen}
          onGo={go}
          tabs={[
            { key: 'home', label: screenTitle(lang, 'home') },
            { key: 'log', label: screenTitle(lang, 'log') },
            { key: 'trends', label: screenTitle(lang, 'trends') },
            { key: 'hist', label: screenTitle(lang, 'hist') },
          ]}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <KantuProvider>
      <AppShell />
    </KantuProvider>
  );
}

export default App;
