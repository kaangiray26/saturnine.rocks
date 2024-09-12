document.addEventListener("DOMContentLoaded", async () => {
    // Get index
    const docs = await fetch("/index.json").then((res) => res.json());

    // Get query
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    // Set query
    document.querySelector("#results-for").textContent = query;

    // Get results
    const fuse = new Fuse(docs, {
        threshold: 0.3,
        includeMatches: true,
        ignoreLocation: true,
        findAllMatches: true,
        useExtendedSearch: true,
        keys: ["title", "excerpt", "tags", "date"],
    });
    const results = fuse.search(`'${query}`, {
        limit: 10,
    });

    // Display results
    const results_ul = document.querySelector("#results");
    if (!results.length) {
        results_ul.innerHTML = "<li>No results found.</li>";
        return;
    }
    console.log(results);
    results.map((res) => {
        // Create elements
        let li = document.createElement("li");
        let a = document.createElement("a");
        let br = document.createElement("br");
        let time = document.createElement("time");
        let tags = document.createElement("p");
        let p = document.createElement("p");

        // Set data
        a.href = res.item.url;
        a.innerHTML = `<h3>${res.item.title}</h3>`;
        time.textContent = `Published on ${res.item.date}`;
        tags.innerHTML = res.item.tags
            .map((tag) => `<span>#${tag}</span>`)
            .join(" ");
        p.textContent = res.item.excerpt;

        // Append elements
        li.appendChild(a);
        li.appendChild(br);
        li.appendChild(time);
        li.appendChild(tags);
        li.appendChild(p);

        // Append to ul
        results_ul.appendChild(li);
    });
});