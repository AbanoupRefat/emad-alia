import { useState } from "react";
import GrandGates from "./pages/GrandGates";
import Page1Hero from "./pages/Page1Hero";
import PageCinema from "./pages/PageCinema";
import Page2Countdown from "./pages/Page2Countdown";
import Page3Story from "./pages/Page3Story";
import Page4Location from "./pages/Page4Location";
import Page5GuestBook from "./pages/Page5GuestBook";
import PageEventTimeline from "./pages/PageEventTimeline";
import Page6Closing from "./pages/Page6Closing";
import AudioPlayer from "./components/AudioPlayer";
import GlobalBackground from "./components/GlobalBackground";
import ThemeToggle from "./components/ThemeToggle";
import { client } from "./config/emadAlia";

export default function App() {
  const [gatesComplete, setGatesComplete] = useState(false);

  return (
    <>
      <GlobalBackground />
      <ThemeToggle />
      {!gatesComplete && (
        <GrandGates
          names={`${client.namesEn.groom} & ${client.namesEn.bride}`}
          onTransitionComplete={() => setGatesComplete(true)}
        />
      )}
      {gatesComplete && <AudioPlayer src="https://raw.githubusercontent.com/AbanoupRefat/emad-alia/main/public/media/perfect.m4a" />}
      <main className="snap-container">
        <Page1Hero />
        <PageCinema />
        <Page2Countdown />
        <Page3Story />
        <Page4Location />
        <Page5GuestBook />
        <PageEventTimeline />
        <Page6Closing />
      </main>
    </>
  );
}

