import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const APS_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUSIsInBpLmF0bSI6Ijd6M2gifQ.eyJzY29wZSI6WyJjb2RlOmFsbCIsImRhdGE6d3JpdGUiLCJkYXRhOnJlYWQiLCJidWNrZXQ6Y3JlYXRlIiwiYnVja2V0OmRlbGV0ZSIsImJ1Y2tldDpyZWFkIl0sImNsaWVudF9pZCI6InhsenJ3UFphbFpzQVZUR0h2YkViYTNmQUFoZG5DQ0t2IiwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2Fqd3RleHA2MCIsImp0aSI6InczS1h2TlNOeW9qWEx5UkJPMEhJTDFvTXpjY0V0dVpGU0JOYVptUHU3bk9oZzVJSElYaG9uczNJWHJRMm9MUGgiLCJleHAiOjE3MDAyMDY1NDZ9.k5ZEq7Tif4aS9YTvpBbT-pwhak3JYKf7KfF4vXB3Hot6CrlDrUHPgzjn4fIS7rEiZClGjPOqVpfLK4pIrXlldzRR6Y0fdOrnJUuutHH9VrMxWQD407-yr0CFGQxOYAGKcOWjcyKbPAG8pEJiv4G2xNpeaAEbB3edJBgtYo-jYmE_f_u8cDmSWC1hR7S7bN-kOAyt_XQXpfrxEpwVBoa5bbin9P7vhzAWX8NqW3L4LsB7q8cs7orFD4XNLz6RBVJ9IpsSJB_W0dFGHcmIANPJNDusNkCKjANWDbn-lphTSZjiNZlS_92PfoFLqxPgvmFMIXVU4Hjjl8rQXvXuehJNcg'; // Specify your access token
const APS_MODEL_URN = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6ZGF5MjIvMC5zdmY='; // Specify your model URN

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!APS_ACCESS_TOKEN || !APS_MODEL_URN) {
    root.render(<div>Please specify <code>APS_ACCESS_TOKEN</code> and <code>APS_MODEL_URN</code> in the source code.</div>);
} else {
    root.render(<App token={APS_ACCESS_TOKEN} urn={APS_MODEL_URN} />);
}
