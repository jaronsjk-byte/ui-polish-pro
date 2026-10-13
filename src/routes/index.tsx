import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import '../story.css'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Our Little Pinky Promise — Lycoris Edition' },
      { name: 'description', content: 'A little letter, a gentle promise, and a place to keep it close.' },
    ],
  }),
  component: Home,
})

function Flower({ id }: { id: string }) {
  return (
    <div className="lycoris-flower" aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ef737c" /><stop offset=".48" stopColor="#9c2035" /><stop offset="1" stopColor="#310b15" />
          </linearGradient>
          <radialGradient id={`${id}-core`}>
            <stop stopColor="#ffb1a2" /><stop offset=".42" stopColor="#d3324c" /><stop offset="1" stopColor="#5a0c20" />
          </radialGradient>
        </defs>
        <g className="flower-petals" stroke={`url(#${id}-petal)`} strokeWidth="2">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path key={angle} d="M200 204 C155 170 113 100 165 44 C203 91 211 143 200 204Z" transform={`rotate(${angle} 200 200)`} fill={`url(#${id}-petal)`} />
          ))}
        </g>
        <g stroke="#d94a60" strokeWidth="2" strokeLinecap="round" opacity=".9">
          <path d="M200 205 Q170 105 111 82M200 205 Q222 91 286 82M200 205 Q265 132 315 150M200 205 Q128 135 78 156M200 205 Q197 95 206 55" />
        </g>
        <circle className="flower-core" cx="200" cy="202" r="22" fill={`url(#${id}-core)`} />
      </svg>
    </div>
  )
}

function Photo({ src, alt, caption, tone }: { src: string; alt: string; caption: string; tone: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`memory-photo ${tone}`}>
      {!failed ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="photo-fallback" role="img" aria-label={alt}>
          <span className="fallback-heart" aria-hidden="true">♡</span><span>A little bear moment</span>
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={diagonal ? 'M7 17 17 7M8 7h9v9' : 'M4 12h15m-6-6 6 6-6 6'} /></svg>
}

function HeartIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" /></svg>
}

function Home() {
  const [activeScene, setActiveScene] = useState(0)
  const [visibleScenes, setVisibleScenes] = useState<number[]>([0])
  const [letterOpen, setLetterOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [linked, setLinked] = useState(false)
  const [visiblePromises, setVisiblePromises] = useState(0)
  const [sealed, setSealed] = useState(false)
  const [handsFailed, setHandsFailed] = useState(false)
  const navigationTimer = useRef<number>(0)

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('.story-scene'))
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = scenes.indexOf(entry.target as HTMLElement)
          setVisibleScenes((current) => current.includes(index) ? current : [...current, index])
        }
      })
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveScene(scenes.indexOf(current.target as HTMLElement))
    }, { threshold: 0.1, rootMargin: '-30% 0px -30% 0px' })
    scenes.forEach((scene) => observer.observe(scene))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!linked) return
    const timers = [450, 1100, 1750].map((delay, index) => window.setTimeout(() => setVisiblePromises(index + 1), delay))
    return () => timers.forEach(window.clearTimeout)
  }, [linked])

  useEffect(() => () => window.clearTimeout(navigationTimer.current), [])

  const goTo = (index: number) => {
    window.clearTimeout(navigationTimer.current)
    document.getElementById(`scene-${index}`)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
  }
  const scheduleGoTo = (index: number, delay: number) => {
    window.clearTimeout(navigationTimer.current)
    navigationTimer.current = window.setTimeout(() => goTo(index), delay)
  }
  const replay = () => {
    window.clearTimeout(navigationTimer.current)
    setLetterOpen(false)
    setReply('')
    setLinked(false)
    setVisiblePromises(0)
    setSealed(false)
    goTo(0)
  }

  return (
    <main className="promise-page">
      <nav className="story-progress" aria-label="Story progress">
        <span className="progress-copy">A little story <b>{String(activeScene + 1).padStart(2, '0')} / 04</b></span>
        <div className="progress-dots">
          {['The letter', 'The question', 'The promise', 'The ending'].map((label, index) => (
            <button key={label} type="button" className={activeScene === index ? 'active' : ''} aria-label={`Go to ${label.toLowerCase()}`} aria-current={activeScene === index ? 'step' : undefined} onClick={() => goTo(index)}>{String(index + 1).padStart(2, '0')}</button>
          ))}
        </div>
      </nav>

      <section className={`story-scene opening ${visibleScenes.includes(0) ? 'is-visible' : ''}`} id="scene-0" aria-labelledby="opening-title">
        <Flower id="opening" />
        <div className="scene-inner opening-grid">
          <div className="opening-copy reveal">
            <span className="handwritten">just for you</span>
            <p className="eyebrow"><span className="star" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 2 2.6 6.8L22 12l-7.4 3.2L12 22l-2.6-6.8L2 12l7.4-3.2L12 2Z" /></svg></span> a small thing, made with a lot of love</p>
            <h1 id="opening-title">Our Little<br /><em>Pinky Promise</em></h1>
            <p className="intro">I made a tiny place for a promise I want you to keep.</p>
            <button className="pill-button open-button" type="button" onClick={() => {
              if (letterOpen) { goTo(1); return }
              setLetterOpen(true)
              scheduleGoTo(1, 650)
            }}><span>{letterOpen ? 'The note is open…' : 'Open my little secret'}</span><span className="button-mark"><ArrowIcon diagonal /></span></button>
            <p className="quiet">for the person I call <b>Dear</b></p>
          </div>
          <div className="envelope-wrap">
            <span className="scribble note-one">a little note for Dear</span><span className="spark spark-one" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 2 2.6 6.8L22 12l-7.4 3.2L12 22l-2.6-6.8L2 12l7.4-3.2L12 2Z" /></svg></span><span className="spark spark-two" aria-hidden="true"><HeartIcon /></span>
            <div className={`envelope ${letterOpen ? 'open' : ''}`} role="img" aria-label={letterOpen ? 'An opened letter tied with a rose seal' : 'A folded paper letter tied with a rose seal'}>
              <div className="env-back" /><div className="env-paper"><strong>Dear,</strong><small>there’s one little thing…</small></div><div className="env-front" /><div className="env-flap" /><div className="env-seal">LP</div>
            </div>
            <span className="scribble note-two">a promise, folded up small</span>
          </div>
        </div>
      </section>

      <section className={`story-scene question-scene ${visibleScenes.includes(1) ? 'is-visible' : ''}`} id="scene-1" aria-labelledby="question-title">
        <Flower id="question" />
        <div className="scene-inner question-grid">
          <div className="reveal">
            <p className="scene-number">02 <span>·</span> something on my mind</p><span className="handwritten">okay, here goes…</span>
            <h2 id="question-title">Can I ask you for one tiny promise?</h2><p className="support">No wrong answers. Both get you to the good part.</p>
            <div className="reply-actions">
              <button className="reply-button" type="button" disabled={Boolean(reply)} onClick={() => { setReply('I knew you’d hear me out.'); scheduleGoTo(2, 650) }}><span className="reply-label"><HeartIcon /> Okay, tell me</span><ArrowIcon /></button>
              <button className="reply-button" type="button" disabled={Boolean(reply)} onClick={() => { setReply('That’s the perfect question to ask.'); scheduleGoTo(2, 650) }}><span className="reply-label"><HeartIcon /> Hmm… what is it?</span><ArrowIcon /></button>
            </div>
            <p className="reaction" aria-live="polite">{reply ? `“${reply}”` : ''}</p>
          </div>
          <div className="scrapbook reveal" aria-label="A little scrapbook of sweet moments">
            <span className="handwritten scrapbook-caption">the question I rehearsed</span><span className="tape tape-one" aria-hidden="true" />
            <Photo src="https://media1.tenor.com/m/xZuPwzRvI2kAAAAC/bear-joke-bear.gif" alt="A bear thinking while the question hangs in the air" caption="give me a second to ask this properly" tone="photo-one" />
            <Photo src="https://media1.tenor.com/m/Eazcnx5O-bgAAAAC/dudu-dudu-cute.gif" alt="A small bear cheering someone on" caption="a tiny cheer from the sidelines" tone="photo-two" />
            <span className="tape tape-two" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className={`story-scene promise-scene ${visibleScenes.includes(2) ? 'is-visible' : ''}`} id="scene-2" aria-labelledby="promise-title">
        <Flower id="promise" />
        <div className="scene-inner promise-grid">
          <div className="reveal">
            <p className="scene-number">03 <span>·</span> the bit that matters</p><span className="handwritten">pinky swear?</span>
            <h2 id="promise-title">Just us, and a little finger-crossed wish.</h2><p className="support">Our promise, in three gentle parts.</p>
            <div className="promise-lines" aria-live="polite">
              {['Even when the day feels difficult, let’s talk honestly.', 'Let’s be kind to each other, even when we disagree.', 'And let’s keep choosing to understand each other.'].map((line, index) => (
                <p className={`promise-line ${visiblePromises > index ? 'shown' : ''}`} key={line}><b>{String(index + 1).padStart(2, '0')}</b><span>{line}</span></p>
              ))}
            </div>
            <button className="pill-button link-button" type="button" disabled={linked} onClick={() => setLinked(true)}><span>{linked ? 'Our pinkies are linked' : 'Link our little fingers'}</span><HeartIcon /></button>
            <button className="next-button" type="button" disabled={visiblePromises < 3} onClick={() => goTo(3)}><span>Then seal our little promise</span><ArrowIcon /></button>
          </div>
          <div className="hand-scene reveal">
            <div className="hand-label"><span>two hands</span><i /><span>one small promise</span></div>
            {!handsFailed ? <img className={`hands ${linked ? 'linked' : ''}`} src="https://media1.tenor.com/m/Yot5XKvLjbcAAAAd/pinky-promise.gif" alt="Two hands linking their little fingers in a pinky promise" loading="lazy" onError={() => setHandsFailed(true)} /> : <div className="hands-fallback" role="img" aria-label="A small heart illustration for the pinky promise"><HeartIcon /><span>still keeping this promise close</span></div>}
            <p className="hand-caption">the little fingers do the talking</p>
            <div className="tenor-ribbon">
              <a className="mini-gif" href="https://tenor.com/view/pinky-promise-cute-kawaii-love-gif-11805504" target="_blank" rel="noopener noreferrer"><span className="mini-flower" aria-hidden="true"><HeartIcon /></span><span>the old-fashioned way still works <ArrowIcon diagonal /></span></a>
              <a className="mini-gif" href="https://tenor.com/view/anime-pinky-swear-promise-gif-2802480833261955229" target="_blank" rel="noopener noreferrer"><span className="mini-flower" aria-hidden="true"><HeartIcon /></span><span>and that’s the whole point <ArrowIcon diagonal /></span></a>
            </div>
          </div>
        </div>
      </section>

      <section className={`story-scene ending-scene ${visibleScenes.includes(3) ? 'is-visible' : ''}`} id="scene-3" aria-labelledby="ending-title">
        <Flower id="ending" />
        <div className="scene-inner ending-content reveal">
          <p className="scene-number">04 <span>·</span> keep this close</p><span className="handwritten">made for my Dear</span><h2 id="ending-title">Pinky promise?</h2>
          <p className="support">One last little thing before you go.</p>
          <button className="pill-button seal-button" type="button" disabled={sealed} onClick={() => setSealed(true)}><span className="seal-mark">LP <HeartIcon /></span><span>{sealed ? 'Our promise is sealed' : 'Seal our promise'}</span><ArrowIcon /></button>
          {sealed && <div className="sealed-message"><p>No matter how small this page is, I made it with a big place in my heart for you. This is our little promise.<span>always, me <HeartIcon /></span></p><button className="replay-button" type="button" onClick={replay}><svg className="replay-mark" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11a9 9 0 1 1 2.6 6.4M3 4v7h7" /></svg> Read our promise again</button></div>}
          <p className="footnote">{sealed ? 'promise kept close, always' : 'a soft place to come back to'}</p>
        </div>
      </section>
    </main>
  )
}
