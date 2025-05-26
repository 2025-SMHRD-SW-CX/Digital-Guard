// src/composable/useAppVhSetter.js

export function useAppVhSetter(document) {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--app-vh', `${vh * 100}px`)
}