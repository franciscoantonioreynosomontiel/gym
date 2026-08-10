// Main JavaScript file for Gym Admin Platform
// Fully prepared for future integration with Supabase, Cloudinary, etc.

document.addEventListener("DOMContentLoaded", () => {
  // Setup keyboard accessibility for any keyboard-focused elements
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tile.click();
      }
    });
  });

  // Future Supabase & Cloudinary initialization placeholder
  console.log("Gym Platform initialized. Ready for API and DB integrations.");
});
