import ApiKeyManager from "./lib";
import { DefaultApiKeyManagerProvider } from "./libs/sample-provider";

function App() {
  const defaultProvider = new DefaultApiKeyManagerProvider(
    "https://sample-api-key-auth-translation-clone-main-fde7724.d2.zuplo.dev",
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImItMjUyUHZmZDdQUFRXeWZscmxXbyJ9.eyJvcmctaWQiOiJzYWxlcy13ZXN0IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLWRlbW8tdGVuYW50LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNjYwNDU2MjEwNTY2OTc0MjY2MyIsImF1ZCI6WyJodHRwczovL215LXNhbXBsZS8iLCJodHRwczovL2F1dGgtZGVtby10ZW5hbnQudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5MDkyNzA1NSwiZXhwIjoxNjkxMDEzNDU1LCJhenAiOiI3Y0huVXlodTFoam5nM0VyUVZ0Rk42NnhMclhuRU16dSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.UrYdCEacUSWgW2PXjxoHB4OEdFLWhYrm_zzKmmLnkZfQ93JIPbq6jBC-UH-ZFcGSR7SQXiDZfe7eOyLzJdDiN1pwr28bO0bvMCZAr4i4C0idNFTAwvAZILWQRGhdh9BSiScmAq3YOcsJPi5vtOom2oY2pEAkCidcKH-WLTVR4UGeGUm6ZzbiRHJKHALge30BoQhmL_s6Ad-uvaCFiVGz03Yx0hE0z_N_KpqSyoKAozJ0nMnGkaaiEiKpFzMeDvHzLvUEj95WDN_z9g4cb5kv8jOL1tWK3kL02IPoHrYtlRTBsHKKD30FcRiIq9Gs9ihz8xhMquN9_o7JYv7YsVSbuA"
  );
  return (
    <div className="w-screen h-screen">
      <ApiKeyManager provider={defaultProvider} />
    </div>
  );
}

export default App;
