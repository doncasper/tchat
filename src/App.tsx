import { ChatOverlay } from './components/ChatOverlay';
import { QueryParamService } from './services/config/QueryParamService';

function App() {
  const config = QueryParamService.parseQueryParams();
  return <ChatOverlay channel={config.channel} config={config} />;
}

export default App;
