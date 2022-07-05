<script>
    import { slippage } from "./stores.js";
    let showSettings = true;
    function openSettingsModal() {
        showSettings = false;
    }
    function closeSettingsModal() {
        showSettings = true;
    }
    function setSllipage(_value) {
        slippage.update((n) => (n = _value));
        console.log($slippage);
    }
</script>

<p class="text-right">
    <span
        class="mdso text-slate-400 hover:text-indigo-300 dark:text-slate-600 dark:hover:text-sky-600 cursor-pointer transition delay-80 ease-in-out"
        on:click={() => openSettingsModal()}>tune</span
    >
</p>
<div
    class:hidden={showSettings}
    class="w-full h-full absolute top-0 left-0 rounded-xl bg-white/[0.9] dark:bg-slate-900/[0.95] text-slate-600 dark:text-slate-400"
>
    <div
        class="flex justify-between bg-slate-50/[0.8] border-b dark:bg-slate-900 dark:border-slate-800 p-4 rounded-t-lg"
    >
        <p class="flex text-lg font-semibold items-center ">
            <span class="mdso text-slate-500 mr-2">tune</span>
            Settings
        </p>
        <button
            class="mdso hover:text-red-600/[0.5]"
            on:click={() => closeSettingsModal()}>close</button
        >
    </div>
    <div class="flex flex-col p-4">
        <div
            class="border border-slate-200 dark:border-slate-800 p-4 rounded-lg"
        >
            <p class="text-sm font-semibold">Slippage Tolerance</p>
            <div class="flex space-x-3 mt-3 text-slate-400">
                <span
                    on:click={() => setSllipage(0.1)}
                    class="font-bold px-5 py-1 border rounded-full dark:hover:border-indigo-900 cursor-pointer {$slippage ==
                    0.1
                        ? 'text-sky-500 dark:bg-indigo-900 dark:text-indigo-200 border-sky-500 dark:border-indigo-600 dark:hover:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-600 hover:text-sky-500 dark:hover:text-indigo-600'}"
                    >0.1%
                </span>

                <span
                    on:click={() => setSllipage(0.5)}
                    class="font-bold px-5 py-1 border rounded-full dark:hover:border-indigo-900 cursor-pointer {$slippage ==
                    0.5
                        ? 'text-sky-500 dark:bg-indigo-900 dark:text-indigo-200 border-sky-500 dark:border-indigo-600 dark:hover:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-600 hover:text-sky-500 dark:hover:text-indigo-600'}"
                    >0.5%
                </span>

                <span
                    on:click={() => setSllipage(1)}
                    class="px-5 py-1 border rounded-full dark:hover:border-indigo-900 cursor-pointer {$slippage ==
                    1
                        ? 'bg-slate-100 text-sky-500 dark:bg-indigo-900 dark:text-indigo-200 border-sky-500 dark:border-indigo-600 dark:hover:bg-slate-900'
                        : 'border-slate-200 dark:border-slate-600 hover:text-sky-500 dark:hover:text-indigo-600'}"
                    >1.0%
                </span>
            </div>
        </div>
    </div>
</div>
