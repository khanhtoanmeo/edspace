import Layout from "../components/Layout/Layout";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
function MyApp({ Component, pageProps }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
