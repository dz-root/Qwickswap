<script>
    import { onMount } from "svelte";
    let dark = false;
    let themeLastSettings, toggleTheme;

    const darkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
</svg>`;

    const lightIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`;
    onMount(() => {
        themeLastSettings = localStorage.getItem("data-theme");
        if (
            themeLastSettings === "dark" ||
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            // dark saved, or system's user is dark
            if (themeLastSettings != "light") {
                // don't turn dark if light was saved, in case the system is configured dark
                document.body.classList.add("dark");
                dark = true;
                // Save for the slider animation
                localStorage.setItem("data-theme", "dark");
            }
        }

        toggleTheme = () => {
            dark = !dark;
            document.body.classList.toggle("dark");
            localStorage.setItem("data-theme", dark ? "dark" : "light");
        };
    });
</script>

<div
    class="flex w-full bg-white/[0.4] dark:bg-slate-900/[0.6] justify-center px-3 py-4 sm:p-3 shadow-xl shadow-slate-200/50"
>
    <div
        class="flex items-center justify-between w-full sm:w-8/12 text-slate-500 dark:text-slate-400"
    >
        <button
            class="w-14 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center transition duration-300 focus:outline-none shadow"
            on:click={() => toggleTheme()}
        >
            <div
                id="switch-toggle"
                class="w-8 h-8 relative border rounded-full transition duration-500 transform p-1 text-white 
                {dark
                    ? 'translate-x-full bg-indigo-800 text-white border-none'
                    : '-translate-x-2 bg-white text-yellow-500 border-yellow-500'}"
            >
                {@html dark ? darkIcon : lightIcon}
            </div>
        </button>
        2022 - Qwickswap.io
        <div class="flex space-x-3 sm:space-x-6">
            <a href="/faq" class="hover:text-indigo-600">FAQ</a>
            <a href="/about" class="hover:text-indigo-600">About</a>
        </div>
    </div>
</div>
