/* oxlint-disable next/no-html-link-for-pages -- Native links match editorial routes. */
export function EnglishDiscordMicVolumeDiagram() {
  return (
    <figure className="voice-direction-diagram" aria-labelledby="voice-direction-title">
      <figcaption id="voice-direction-title">
        <strong>Which is quiet: the voice you send or the voice you hear?</strong>
        <span>This explains the audio direction and who checks it; it is not a settings screenshot.</span>
      </figcaption>
      <div className="voice-direction-path">
        <strong>Other people say your voice is quiet</strong>
        <p>Your microphone → your input settings → the listener’s playback volume</p>
        <ul>
          <li><a href="#cause-1">Only one listener: they check the user volume assigned to you</a></li>
          <li><a href="#cause-2">Everyone: compare your Windows recording and Discord test</a></li>
        </ul>
      </div>
      <div className="voice-direction-path">
        <strong>You hear another person quietly</strong>
        <p>Their voice → your per-user/output volume → your headphones</p>
        <a href="/discord/user-volume-low">Check the listening side in the quiet-caller guide (Japanese) →</a>
      </div>
      <p className="source-policy">Raising your microphone input does not raise the other person’s voice in your headphones. Recording and call comparisons are steps for you to perform, not measured volume or improvement results from the editorial team.</p>
    </figure>
  );
}
