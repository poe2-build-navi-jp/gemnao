// Only for local testing where OS network-interface inventory is unavailable.
// Does not alter production, authentication, or network access policy.
import os from 'node:os';
const original = os.networkInterfaces;
os.networkInterfaces = () => {
  try {
    return original();
  } catch {
    return {
      lo: [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8',
        },
      ],
    };
  }
};
