import { ChatOverlay } from './components/ChatOverlay';
import { defaultTheme } from './themes/default';
import { QueryParamService } from './services/config/QueryParamService';

function App() {
  const config = QueryParamService.parseQueryParams();
  return <ChatOverlay channel={config.channel} theme={defaultTheme} config={config} />;
}

export default App;
