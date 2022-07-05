<script>
    import { currentChain, currentChainID } from "./stores.js";
    let hidden = false;
    let chainsList = {
        "0x1": {
            id: "1",
            name: "eth",
            sym: "eth",
            logo: "eth.png",
            pool: "",
        },
        "0x38": {
            id: "56",
            name: "bsc",
            sym: "bnb",
            logo: "bsc.png",
            pool: "",
        },
        "0x89": {
            id: "137",
            name: "polygon",
            sym: "matic",
            logo: "polygon.png",
            pool: "",
        },
    };

    const openModal = () => (hidden = true);
    const closeModal = () => (hidden = false);

    async function switchNetwork(chid = "") {
        const chainIdHex = await Moralis.switchNetwork(chid);
        currentChain.update((e) => (e = chainsList[chid].name));
        currentChainID.update((e) => (e = chid));
        closeModal();
    }
</script>

<div on:click={openModal} class="flex items-center justify-center">
    <img src={chainsList[$currentChainID].logo} class="w-8" alt="blockchain" />
    <p class="hidden sm:inline-block mx-2 uppercase">{$currentChain}</p>
</div>

<!-- Modal network -->
<div
    class:hidden={hidden === false}
    class="fixed w-full h-screen flex flex-col items-center justify-center left-0 top-0 p-4 z-10 bg-white/75 dark:bg-slate-800/75"
>
    <div
        class="flex flex-col relative w:full sm:w-1/4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl rounded-lg p-8"
    >
        <span
            on:click={closeModal}
            class="mdso text-indigo-600 absolute top-2 right-2 sm:-top-10 sm:-right-10 cursor-pointer"
        >
            close
        </span>

        <div class="flex items-center mb-4">
            <h2 class="flex-1 text-xl">Select a Network</h2>
            <div class="text-indigo-400">
                <div class="flex items-center p-2 ml-2">
                    <div
                        class="flex relative h-2 w-2 rounded-full bg-green-500 mr-2"
                    >
                        <span
                            class="animate-ping inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75"
                        />
                    </div>
                    <p>
                        <span id="current_network" class="font-bold uppercase">
                            {$currentChain}
                        </span>
                    </p>
                </div>
            </div>
        </div>

        <div class="flex justify-between">
            <div
                on:click={() => switchNetwork("0x1")}
                class="group flex flex-col w-1/3 items-center border border-indigo-10 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-600 rounded-lg mx-2 cursor-pointer"
            >
                <img
                    src="eth.png"
                    class="w-24 mb-3"
                    alt="Switch to Ethereum network"
                />
                <p
                    class="w-full bg-indigo-50 dark:bg-slate-800 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-slate-900 text-center text-indigo-400 group-hover:text-indigo-100 p-2 rounded-b-md"
                >
                    ETH
                </p>
            </div>
            <div
                on:click={() => switchNetwork("0x38")}
                class="group flex flex-col w-1/3 items-center border border-indigo-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-600 rounded-lg mx-2 cursor-pointer"
            >
                <img
                    src="bsc.png"
                    class="w-24 mb-3"
                    alt="Switch to BSC network"
                />
                <p
                    class="w-full bg-indigo-50 dark:bg-slate-800 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-slate-900 text-center text-indigo-400 group-hover:text-indigo-100 p-2 rounded-b-md"
                >
                    BSC
                </p>
            </div>
            <div
                on:click={() => switchNetwork("0x89")}
                class="group flex flex-col w-1/3 items-center border border-indigo-100 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-600 rounded-lg mx-2 cursor-pointer"
            >
                <img
                    src="polygon.png"
                    class="w-24 mb-3"
                    alt="Switch to Polygone network"
                />
                <p
                    class="w-full bg-indigo-50 dark:bg-slate-800 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-slate-900 text-center text-indigo-400 group-hover:text-indigo-100 p-2 rounded-b-md"
                >
                    Polygon
                </p>
            </div>
        </div>
    </div>
</div>
