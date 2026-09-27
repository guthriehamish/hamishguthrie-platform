import './style.css'

const areas = [
  ['Today', 'Your daily check-in and the next useful action.'],
  ['Move', 'Workouts, activities and active minutes.'],
  ['Fuel', 'Simple healthier-choice check-ins.'],
  ['Progress', 'Goals, streaks, achievements and momentum.'],
  ['Together', 'Accountability and workout mates.'],
  ['My Direction', 'Your own transformation focus and goals.']
]

document.querySelector('#app').innerHTML = `
  <main>
    <section class="hero">
      <p class="eyebrow">TRANSFORM WITH ME</p>
      <h1>Consistent.<br>Persistent.<br><span>Targeted.</span></h1>
      <p class="intro">Transformation without perfection. Show up, make the next useful choice, and keep moving.</p>
      <button id="begin">Begin today</button>
    </section>

    <section class="panel" id="today">
      <div class="panel-head">
        <div>
          <p class="eyebrow">YOUR PLATFORM</p>
          <h2>Today</h2>
        </div>
        <div class="streak"><strong>Day 1</strong><span>Start where you are</span></div>
      </div>
      <div class="grid">
        ${areas.map(([name, copy]) => `
          <article class="card">
            <h3>${name}</h3>
            <p>${copy}</p>
            <button class="text-button" data-area="${name}">Open →</button>
          </article>
        `).join('')}
      </div>
    </section>

    <footer>Join me. Transform. Get results.</footer>
  </main>
`

document.querySelector('#begin').addEventListener('click', () => {
  document.querySelector('#today').scrollIntoView({ behavior: 'smooth' })
})

document.querySelectorAll('[data-area]').forEach(button => {
  button.addEventListener('click', () => {
    alert(`${button.dataset.area} is ready for its engine.`)
  })
})
