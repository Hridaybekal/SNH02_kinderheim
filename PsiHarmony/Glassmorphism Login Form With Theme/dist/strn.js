const themes = [
  {
    background: "#cfd6c4",
    color: "#000",
    primaryColor: "#657166"
  },
  {
    background: "#2b7787",
    color: "#FFFFFF",
    primaryColor: "#E94560"
  },
  {
    background: "#99cdd8",
    color: "#FFFFFF",
    primaryColor: "#687a86"
  },
  {
    background: "#f3c3b2",
    color: "#000000",
    primaryColor: "#F4845F"
  },
  {
    background: "#fde8d3",
    color: "#000000",
    primaryColor: "#642B36"
  },
  {
    background: "#231F20",
    color: "#FFF",
    primaryColor: "#cfd6c4"
  }
];

const setTheme = (theme) => {
  const root = document.querySelector(":root");
  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--color", theme.color);
  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--glass-color", theme.glassColor);
};

const displayThemeButtons = () => {
  const btnContainer = document.querySelector(".theme-btn-container");
  themes.forEach((theme) => {
    const div = document.createElement("div");
    div.className = "theme-btn";
    div.style.cssText = `background: ${theme.background}; width: 25px; height: 25px`;
    btnContainer.appendChild(div);
    div.addEventListener("click", () => setTheme(theme));
  });
};

displayThemeButtons();