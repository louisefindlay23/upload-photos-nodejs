document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    document.querySelectorAll("img").forEach((img) => {
      img.src = img.src.replace("public/", "");
    });
  }
});
