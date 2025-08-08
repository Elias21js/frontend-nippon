import { renderSwiper } from "../services/Home.services.jsx";

export async function handleChart(target, chart, action = "show") {
  const charts = document.querySelector("#charts");
  const ranking = document.querySelector("#ranking-chart");
  const ranking_menu = document.querySelector(".ranking-div");
  const semanal = document.querySelector("#ranking-semanal");
  const performance = document.querySelector("#ranking-performance");
  if (action === "hide") {
    ranking?.classList.remove("visible");
    semanal?.classList.remove("visible");
    ranking_menu?.classList.remove("visible");
    performance?.classList.remove("visible");
    charts?.classList.remove("visible");
    return;
  }

  smoothScrollTo(target, 1000);

  if (chart === "pessoal") {
    ranking.classList.remove("visible");
    semanal.classList.remove("visible");
    performance.classList.remove("visible");
    ranking_menu.classList.remove("visible");
    charts.classList.add("visible");
  } else if (chart === "ranking") {
    charts.classList.remove("visible");
    semanal.classList.remove("visible");
    performance.classList.remove("visible");
    ranking_menu.classList.add("visible");
    ranking.classList.add("visible");
  } else if (chart === "semanal") {
    charts.classList.remove("visible");
    ranking.classList.remove("visible");
    performance.classList.remove("visible");
    semanal.classList.add("visible");
    await renderSwiper();
  } else if (chart === "performance") {
    charts.classList.remove("visible");
    ranking.classList.remove("visible");
    semanal.classList.remove("visible");
    performance.classList.add("visible");
  }
}

export function smoothScrollTo(targetY, duration) {
  const realTarget = targetY.getBoundingClientRect().top + window.pageYOffset - 20;
  const startY = window.pageYOffset;
  const distance = realTarget - startY;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, startY + distance * ease);

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
