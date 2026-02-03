const iceConfiguration = {
  iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:standard.relay.metered.ca:80",
        username: "52f5c726efedc54f7ce0f5a7",
        credential: "JjWirqPvJn845U/Y",
      },
      {
        urls: "turn:standard.relay.metered.ca:80?transport=tcp",
        username: "52f5c726efedc54f7ce0f5a7",
        credential: "JjWirqPvJn845U/Y",
      },
      {
        urls: "turn:standard.relay.metered.ca:443",
        username: "52f5c726efedc54f7ce0f5a7",
        credential: "JjWirqPvJn845U/Y",
      },
      {
        urls: "turns:standard.relay.metered.ca:443?transport=tcp",
        username: "52f5c726efedc54f7ce0f5a7",
        credential: "JjWirqPvJn845U/Y",
      },
  ],
};

export default iceConfiguration