document.querySelector(".start-button span").addEventListener("click", (_) => {
  let name = window.prompt("What's Your Name?");
  if (name) {
    document.querySelector(".start-button").remove();
    document.querySelector(".name span").innerHTML = name;
    startGame(name);
  }
});

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGame);

document.querySelector(".best-score .name").innerHTML =
  localStorage.getItem("name");
document.querySelector(".best-score .best").innerHTML =
  localStorage.getItem("wrong");

function startGame(name) {
  let wrongTries = document.querySelector(".tries span");
  let blocksContainer = document.querySelector(".blocks");
  let blocks = Array.from(document.querySelectorAll(".blocks .block"));

  let orderRange = [...Array(blocks.length).keys()];

  shuffel(orderRange);
  function shuffel(array) {
    let current = array.length,
      random,
      temp;
    while (current > 0) {
      random = Math.floor(Math.random() * current);
      current--;
      temp = array[current];
      array[current] = array[random];
      array[random] = temp;
    }
  }

  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];

    block.addEventListener("click", (_) => {
      block.classList.add("fliped");
      let flipedBlocks = blocks.filter((block) =>
        block.classList.contains("fliped")
      );
      if (flipedBlocks.length === 2) {
        blocksContainer.classList.add("unclickable");
        setTimeout((_) => {
          blocksContainer.classList.remove("unclickable");
        }, 1000);
        if (flipedBlocks[0].dataset.brand === flipedBlocks[1].dataset.brand) {
          document.getElementById("success").play();
          flipedBlocks.forEach((flipedBlock) => {
            flipedBlock.classList.remove("fliped");
            flipedBlock.classList.add("done");
          });
        } else {
          wrongTries.innerHTML++;
          setTimeout((_) => {
            document.getElementById("fail").play();
            flipedBlocks.forEach((flipedBlock) =>
              flipedBlock.classList.remove("fliped")
            );
          }, 1000);
        }
      }
      let allMathced = blocks.filter((block) =>
        block.classList.contains("done")
      );
      if (allMathced.length === blocks.length) {
        document.getElementById("win").play();
        if (
          wrongTries.innerHTML <= window.localStorage.getItem("wrong") ||
          window.localStorage.getItem("wrong") === null
        ) {
          window.localStorage.setItem("wrong", wrongTries.innerHTML);
          window.localStorage.setItem("name", name);
          document.querySelector(".best-score .name").innerHTML =
            wrongTries.innerHTML;
          document.querySelector(".best-score .best").innerHTML = name;
        }
      }
    });
  });
}

function resetGame() {
  let blocks = Array.from(document.querySelectorAll(".blocks .block"));

  blocks.forEach((block) => {
    block.classList.remove("fliped", "done");
  });
  startGame(localStorage.getItem("name"));
}
