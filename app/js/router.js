/* Layout generator. Builds the unit and module sections dynamically from
   CURRICULUM, applying Gateway locking at the module level when Guided
   Pathway mode is active. */

function renderCurriculum() {
    const container = document.getElementById("app-content");
    if (!container) return;
    container.innerHTML = "";

    const watched = ODEState.getWatchedVideos();
    let flatIndex = 0;

    CURRICULUM.forEach(function (unitData) {
        const unitSection = document.createElement("section");
        unitSection.className = "unit-section";

        const unitHeader = document.createElement("div");
        unitHeader.className = "unit-header";

        const unitTitle = document.createElement("h2");
        unitTitle.className = "unit-title";
        unitTitle.textContent = unitData.unit;

        const unitDesc = document.createElement("p");
        unitDesc.className = "unit-desc";
        unitDesc.textContent = unitData.description;

        unitHeader.appendChild(unitTitle);
        unitHeader.appendChild(unitDesc);
        unitSection.appendChild(unitHeader);

        const moduleList = document.createElement("div");
        moduleList.className = "unit-modules";

        unitData.modules.forEach(function (moduleData) {
            moduleList.appendChild(buildModuleSection(moduleData, flatIndex, watched));
            flatIndex++;
        });

        unitSection.appendChild(moduleList);

        // Unit Mastery quiz, thirty questions, anchored at the bottom of the
        // unit container after all of its modules.
        const mastery = QUIZ_DATA.unit_mastery[unitData.unit];
        if (mastery && mastery.length) {
            const masteryHost = document.createElement("div");
            masteryHost.className = "unit-mastery-host";
            QuizEngine.mount(masteryHost, {
                id: "mastery::" + unitData.unit,
                title: "Unit Mastery Quiz",
                intro: "Thirty questions across the whole unit. Track your score, and let any missed question point you back to its module.",
                items: mastery
            });
            unitSection.appendChild(masteryHost);
        }

        container.appendChild(unitSection);
    });

    updateProgressBanner();
}

function buildModuleSection(moduleData, flatIndex, watched) {
    const unlocked = ODEModes.isModuleUnlocked(flatIndex);

    const section = document.createElement("article");
    section.className = "module-section" + (unlocked ? "" : " locked");

    const header = document.createElement("div");
    header.className = "module-header";

    const title = document.createElement("h3");
    title.className = "module-title";
    title.textContent = moduleData.module;

    const status = document.createElement("span");
    status.className = "module-status";
    if (!unlocked) {
        status.textContent = "Locked, complete the previous checkpoint to continue";
    } else if (ODEState.isCheckpointPassed(moduleData.module)) {
        status.textContent = "Checkpoint passed";
        status.classList.add("passed");
    } else {
        status.textContent = "Open";
    }

    header.appendChild(title);
    header.appendChild(status);
    section.appendChild(header);

    if (unlocked) {
        const videoList = document.createElement("ul");
        videoList.className = "video-list";

        moduleData.videos.forEach(function (video) {
            const item = document.createElement("li");
            item.className = "video-card";

            const link = document.createElement("a");
            link.href = "https://www.youtube.com/watch?v=" + video.video_id;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = video.title;

            const watchLabel = document.createElement("label");
            watchLabel.style.display = "block";
            watchLabel.style.marginTop = "0.5rem";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = watched.includes(video.video_id);
            checkbox.addEventListener("change", function () {
                ODEState.setVideoWatched(video.video_id, checkbox.checked);
                updateProgressBanner();
            });

            watchLabel.appendChild(checkbox);
            watchLabel.appendChild(document.createTextNode(" Mark as watched"));

            item.appendChild(link);
            item.appendChild(watchLabel);

            // Micro Practice for this specific video, rendered directly beneath
            // it so the flow is watch, then practice, video by video.
            const microItems = QUIZ_DATA.micro_practice[video.video_id];
            if (microItems && microItems.length) {
                const microHost = document.createElement("div");
                microHost.className = "video-quiz-host";
                QuizEngine.mount(microHost, {
                    id: "micro::" + video.video_id,
                    title: "Micro Practice",
                    intro: "Five quick checks on this video. A wrong choice gives you a guiding question, not the answer.",
                    items: microItems
                });
                item.appendChild(microHost);
            }

            videoList.appendChild(item);
        });

        section.appendChild(videoList);

        const checkpointPanel = document.createElement("div");
        checkpointPanel.className = "checkpoint-panel";
        CheckpointRegistry.render(moduleData.interactive_checkpoint, checkpointPanel, moduleData);
        section.appendChild(checkpointPanel);
    }

    return section;
}

function updateProgressBanner() {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    if (!progressBar || !progressText) return;

    const totalVideos = ALL_MODULES.reduce(function (sum, m) { return sum + m.videos.length; }, 0);
    const watchedCount = ODEState.getWatchedVideos().length;
    const percentage = totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% (" + watchedCount + " of " + totalVideos + " videos)";
}

document.addEventListener("DOMContentLoaded", renderCurriculum);
