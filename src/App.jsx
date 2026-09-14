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
import ResponsesPage from "./pages/ResponsesPage";
import { client } from "./config/emadAlia";

// ── Private responses view: accessible only via /?view=responses ──
const isResponsesView =
  new URLSearchParams(window.location.search).get("view") === "responses";

export default function App() {
  const [gatesComplete, setGatesComplete] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  // Couple's private view — no gate, no music
  if (isResponsesView) return <ResponsesPage />;

  return (
    <>
      <GlobalBackground />
      {!gatesComplete && (
        <GrandGates
          names={`${client.namesEn.groom} & ${client.namesEn.bride}`}
          onOpened={() => setAudioStarted(true)}
          onTransitionComplete={() => setGatesComplete(true)}
        />
      )}
      {/* Audio mounts the instant the gate opens so the music starts with the bloom effect */}
      {audioStarted && <AudioPlayer src="/media/perfect.m4a" />}
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
