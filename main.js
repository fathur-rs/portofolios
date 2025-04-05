const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
let isOpen = false;

// Toggle menu when burger is clicked
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  isOpen = !isOpen;

  if (isOpen) {
    mobileMenu.classList.remove("max-h-0", "opacity-0", "scale-95");
    mobileMenu.classList.add("max-h-96", "opacity-100", "scale-100");
  } else {
    mobileMenu.classList.remove("max-h-96", "opacity-100", "scale-100");
    mobileMenu.classList.add("max-h-0", "opacity-0", "scale-95");
  }
});

// Close menu if clicking outside
document.addEventListener("click", (e) => {
  if (
    isOpen &&
    !mobileMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    mobileMenu.classList.remove("max-h-96", "opacity-100", "scale-100");
    mobileMenu.classList.add("max-h-0", "opacity-0", "scale-95");
    isOpen = false;
  }
});

async function loadYAMLData() {
  const res = await fetch("data.yaml");
  const yamlText = await res.text();
  const data = jsyaml.load(yamlText);

  const expContainer = document.getElementById("experience-container");
  const detailDiv = document.getElementById("tech-details");
  const eduDiv = document.getElementById("edu-content");
  const projectContainer = document.getElementById("project-content");

  const tech = data.technical_experience;
  const education = data.education;
  const projects = data.projects;

  // About rendering
  document.getElementById("summary-text").textContent = data.summary;

  // Experience rendering
  data.experiences.forEach((exp) => {
    const div = document.createElement("div");
    div.className = "mb-6";
    div.innerHTML = `
        <h3 class="text-xl font-semibold text-blue-800">${exp.company}</h3>
        <p class="text-m font-semibold text-gray-700">${exp.title}, ${
      exp.date
    }</p>
        <ul class="list-disc pl-4 md:pl-12 mt-2 text-gray-700">
          ${exp.points.map((point) => `<li>${point}</li>`).join("")}
        </ul>
      `;
    expContainer.appendChild(div);
  });

  // Technical Experience rendering
  document.getElementById("tech-title").innerHTML = `<p>${tech.title}</p>`;

  detailDiv.innerHTML = `
      <p>${tech.description}</p>
      <ul class="list-disc ml-4 md:ml-8 lg:ml-16">
        ${tech.categories
          .map(
            (cat) => `
          <li>
            <strong>${cat.name}:</strong> ${cat.items.join(", ")}
          </li>
        `
          )
          .join("")}
      </ul>
    `;

  // Education rendering
  eduDiv.innerHTML = education
    .map(
      (edu) => `
        <div class="col-span-1 md:col-span-3 text-xl font-semibold text-blue-800 space-y-4">
          <p>${edu.year}</p>
        </div>
        <div class="col-span-1 md:col-span-9 text-gray-700 space-y-2 text-justify">
          <p>
            <span class="font-bold">${edu.degree}${
        edu.major ? `, ${edu.major}` : ""
      }</span>;
            <span class="font-bold underline">${edu.institution}</span>
            ${edu.note ? `; <span class="italic">${edu.note}</span>` : ""}
          </p>
        </div>
        <div class="block md:hidden"><br /></div>
      `
    )
    .join("");

  // Projects rendering
  projects.forEach((project) => {
    const wrapper = document.createElement("div");
    wrapper.className = "grid grid-cols-1 md:grid-cols-12 md:gap-4";

    const titleDiv = document.createElement("div");
    titleDiv.className = "col-span-1 md:col-span-3 space-y-4";
    titleDiv.innerHTML = `
          <p class="text-gray-600 mt-2 flex">
            <a href="${project.link}" class="relative text-xl inline-block font-semibold text-blue-800 no-underline after:content-[''] after:block after:border-b-2 after:border-blue-800 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-250 after:ease-in-out">
              ${project.name}
            </a>
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4V3ZM8.5 3.5H9C9 3.22386 8.77614 3 8.5 3V3.5ZM8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5H8ZM2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L2.64645 8.64645ZM3.5 4H8.5V3H3.5V4ZM8 3.5V8.5H9V3.5H8ZM8.14645 3.14645L2.64645 8.64645L3.35355 9.35355L8.85355 3.85355L8.14645 3.14645Z" class="fill-current text-blue-800 dark:text-blue-800"></path>
            </svg>
          </p>
        `;

    const descDiv = document.createElement("div");
    descDiv.className =
      "col-span-1 md:col-span-9 text-gray-700 space-y-2 text-justify";
    descDiv.innerHTML = project.descriptions
      .map((desc) => `<p>${desc}</p>`)
      .join("");

    // 🛠 Tools block
    if (project.tools && project.tools.length > 0) {
      const toolDiv = document.createElement("div");
      toolDiv.className =
        "flex flex-wrap gap-4 text-sm font-semibold font-mono mt-2";

      project.tools.forEach((tool) => {
        const toolSpan = document.createElement("span");
        toolSpan.className = "relative group";
        toolSpan.innerHTML = `
              <img src="icon/${tool.icon}" class="w-10 h-10 aspect-square" />
              <span
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 transition-opacity duration-300 bg-gray-700 text-white py-2 px-4 rounded text-xs whitespace-nowrap group-hover:opacity-100"
                aria-hidden="true"
              >
                ${tool.name}
              </span>
            `;
        toolDiv.appendChild(toolSpan);
      });

      descDiv.appendChild(toolDiv);
    }

    // Append everything
    wrapper.appendChild(titleDiv);
    wrapper.appendChild(descDiv);
    projectContainer.appendChild(wrapper);
  });
}

loadYAMLData();
