import { useState } from "react";
import GrandGates from "./pages/GrandGates";
import Page1Hero from "./pages/Page1Hero";
import PageCinema from "./pages/PageCinema";
import Page2Countdown from "./pages/Page2Countdown";
import Page3Story from "./pages/Page3Story";
import Page4Location from "./pages/Page4Location";
import Page5GuestBook from "./pages/Page5GuestBook";
import Page6Closing from "./pages/Page6Closing";
import AudioPlayer from "./components/AudioPlayer";
import GlobalBackground from "./components/GlobalBackground";
import { client } from "./config/emadAlia";

export default function App() {
  const [gatesComplete, setGatesComplete] = useState(false);

  return (
    <>
      <GlobalBackground />
      {!gatesComplete && (
        <GrandGates
          names={`${client.namesEn.groom} & ${client.namesEn.bride}`}
          onTransitionComplete={() => setGatesComplete(true)}
        />
      )}
      {gatesComplete && <AudioPlayer src="https://abanouprefat.github.io/emad-alia/media/perfect.m4a" />}
      <main className="snap-container">
        <Page1Hero />
        <PageCinema />
        <Page2Countdown />
        <Page3Story />
        <Page4Location />
        <Page5GuestBook />
        <Page6Closing />
      </main>
    </>
  );
}

