<script>
    import { onMount } from "svelte";

    onMount(() => {
        function showNotif() {
            document.getElementById("metaNotif").classList.remove("hidden");
        }
        function hideNotif() {
            document
                .getElementById("metaNotif")
                .classList.add("hidden", "cursor-not-allowed");
        }
        document
            .getElementById("swapContainer")
            .addEventListener("mouseover", () => showNotif());

        document
            .getElementById("swapContainer")
            .addEventListener("mouseout", () => hideNotif());
    });
</script>

<div class="grid lg:grid-cols-7 lg:gap-4 items-center h-full md:w-8/12 z-20">
    <div class="lg:col-span-4">
        <div class="p-5 sm:p-0">
            <h1
                class="text-4xl text-center md:text-left md:text-6xl font-bold text-slate-700 dark:text-slate-300"
            >
                Swap Tokens in an instant on ETH, BSC and Polygon
            </h1>
        </div>
        <div
            class="flex justify-center sm:justify-start space-x-3 mt-2 mb-5 md:mt-10"
        >
            <img
                class="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-indigo-900 rounded-xl p-2"
                src="eth.png"
                alt="ETH Blockchain"
            />
            <img
                class="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-indigo-900 rounded-xl p-2"
                src="bsc.png"
                alt="Binance Smart Chain"
            />
            <img
                class="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-indigo-900 rounded-xl p-2"
                src="polygon.png"
                alt="Polygon"
            />
        </div>
    </div>

    <div class="flex items-center justify-center lg:col-span-3 mb-10">
        <div
            id="swapContainer"
            class="swap-box relative flex flex-col bg-white/[0.3] dark:bg-slate-900/[0.6] w-11/12 border dark:border-slate-800 p-4 rounded-xl shadow-lg shadow-slate-200/75 dark:shadow-slate-900"
        >
            <div
                id="metaNotif"
                class="absolute flex flex-col items-center justify-center top-0 left-0 w-full h-full bg-slate-100/75 dark:bg-slate-900/75 text-slate-500 rounded-md hidden"
            >
                <div
                    class="relative w-20 h-20 border-4 border-red-600 p-2 rounded-full"
                >
                    <img src="metamask.png" class="w-16" alt="" />
                    <span class="flex h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"
                        />
                        <span
                            class="relative inline-flex rounded-full h-3 w-3 bg-red-600"
                        />
                    </span>
                </div>
                <p class="text-center p-4">
                    <span class="font-bold">
                        It seems that MetaMask is disconnected.
                    </span><br />
                    Please log in to your Metamask and allow the Qwickswap connection
                    request.
                </p>
                <p class="text-sm mt-5">
                    Don't have MetaMask?
                    <a
                        href="https://metamask.io/"
                        target="_blank"
                        class="font-bold">Install</a
                    >
                </p>
            </div>
            <div class="flex mb-2">
                <span
                    class="flex-1 text-sm sm:text-base font-bold text-slate-400 mb-2"
                >
                    Change tokens in an instant
                </span>
                <p class="text-right">
                    <span class="mdso text-slate-500">tune</span>
                </p>
            </div>

            <!-- Token from-->
            <div
                class="token-list w-full flex flex-col rounded-xl p-3 bg-slate-50/[0.2] dark:bg-slate-900/[0.3] border dark:border-slate-800 border-slate-200"
            >
                <div
                    class="tag flex justify-between text-slate-500 text-xs mb-1"
                >
                    From
                    <div class="flex space-x-1">
                        <span>Current Price</span> <span id="token_price" />
                    </div>
                </div>

                <div class="w-full flex items-center space-x-2">
                    <div
                        class="w-full flex items-center justify-between rounded-full cursor-pointer border border-slate-300 dark:border-slate-700 px-2"
                    >
                        <div class="flex items-center">
                            <img
                                id="from_token_img"
                                src="swap_from.png"
                                class="w-6 h-6 m-2"
                                alt="swap form"
                            />
                            <span
                                id="from_token_symbol"
                                class="text-slate-500 font-bold">From</span
                            >
                        </div>
                        <span class="mdso text-slate-400"
                            >keyboard_arrow_down</span
                        >
                    </div>
                    <input
                        id="from_amount"
                        class="w-full grow text-right text-xl font-bold px-2 py-2 bg-slate-50 dark:bg-slate-900/[0.01] dark:text-white rounded-md focus:outline-none focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-900 dark:focus:ring-indigo-900 focus:ring-1"
                        placeholder="0.00"
                    />
                </div>
                <div class="token_info flex my-2">
                    <div class="flex-1 text-slate-400 text-xs font-bold">
                        <span id="from_token_name" />
                    </div>
                    <div class="text-slate-500 text-xs">
                        $ <span id="esimated_price" />
                    </div>
                </div>
            </div>

            <!-- Reverse token -->
            <div class="flex justify-center mb-3 -mt-3">
                <div
                    class="flex justify-center items-center text-indigo-300 bg-indigo-50 dark:text-indigo-100 dark:bg-gradient-to-r dark:from-sky-500 dark:to-indigo-500 w-8 h-8 border border-indigo-200 dark:border-none rounded-full cursor-pointer hover:bg-indigo-300 hover:text-white hover:rotate-180 ease-in-out duration-300"
                >
                    <span class="mdso text-lg">arrow_downward</span>
                </div>
            </div>

            <!-- Token to-->
            <div
                class="token-list w-full flex flex-col rounded-xl p-3 mb-8 bg-slate-50/[0.2] dark:bg-slate-900/[0.3] border dark:border-slate-800 border border-slate-200"
            >
                <div class="tag text-slate-500 text-xs mb-1">
                    To (estimated)
                </div>
                <div class="w-full flex space-x-2 items-center">
                    <div
                        class="w-full flex items-center justify-between rounded-full cursor-pointer border border-slate-300 px-2 dark:border-slate-700"
                    >
                        <div class="flex items-center">
                            <img
                                id="to_token_img"
                                src="swap_to.png"
                                class="w-6 h-6 m-2"
                                alt="swap to"
                            />
                            <span
                                id="to_token_symbol"
                                class="text-slate-500 font-bold">To</span
                            >
                        </div>
                        <span class="mdso text-slate-400"
                            >keyboard_arrow_down</span
                        >
                    </div>
                    <input
                        id="to_amount"
                        disabled
                        class="w-full grow text-right text-xl font-bold px-2 py-3 bg-slate-50 dark:bg-slate-900/[0.01] dark:text-white rounded-r-md"
                        placeholder="0.00"
                    />
                </div>
                <div class="token_info flex my-2">
                    <div class="flex-1 text-slate-400   text-xs font-bold">
                        <span id="to_token_name" />
                    </div>
                    <div class="tag text-slate-400 text-xs">
                        Estimated Gas: --<span id="gas_amount" />
                    </div>
                </div>
            </div>
            <button
                id="swap_btn"
                class="flex items-center justify-center font-bold text-slate-400 bg-white/[0.2] dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border dark:border-slate-700 rounded-md p-4 shadow-xl shadow-indigo-200/[0.3] dark:shadow-sky-600/[0.2] ease-in-out duration-200"
            >
                <span class="mdso mr-5">swap_horiz</span> Swap
            </button>
        </div>
    </div>
</div>
