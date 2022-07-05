<script>
    import { onMount } from "svelte";
    import ChainSwitcher from "./switchChain.svelte";
    import {
        currentUser,
        currentChain,
        nativeBalance,
        currentChainID,
    } from "./stores.js";

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

    $: currentChain;
    $: nativeBalance;

    // Sign in function
    async function handleSignIn() {
        if ($currentUser) return;
        // Authenticate with MetaMask (Moralis API)
        const user = await Moralis.authenticate({
            signingMessage: "Sign in to QwickSwap",
        });
        // Update value of current user store
        $currentUser = user;
    }

    // Sign out function
    async function handleSignOut() {
        await Moralis.User.logOut();
        $currentUser = null;
    }

    // Call configuration function when mounted
    onMount(() => {
        //getBal();
    });
</script>

<div
    class="header flex w-full bg-white/[0.4] dark:bg-slate-900/[0.6] justify-center border-b dark:border-none p-2 sm:p-3 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50"
>
    <div class="flex items-center justify-between w-11/12 sm:w-8/12">
        <div class="flex-1">
            <a href="/" class="logo flex font-bold items-center ">
                <img
                    src="qwickswap_icon.png"
                    class="w-6 mr-2"
                    alt="logo qwickswap"
                />
                <p class="text-lg dark:text-white">QwickSwap</p>
            </a>
        </div>

        <div class="flex space-x-3">
            {#if $currentUser == "loading"}
                <button
                    on:click={() => handleSignIn()}
                    class="flex items-center text-white font-bold bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 rounded-full hover:bg-gradient-to-b hover:shadow-lg transition duration-0 hover:duration-150"
                >
                    <img
                        src="metamask.png"
                        class="w-6 mr-2"
                        alt="login with metamask"
                    />
                    Unlock
                    <span class="hidden sm:inline-block ml-1">MetaMask</span>
                </button>
            {:else if $currentUser}
                <div id="user_control" class="flex space-x-1 sm:space-x-4">
                    <div
                        class="flex items-stretch space-x-2 px-2 font-bold rounded-lg"
                    >
                        <span
                            class="flex items-center text-slate-500 bg-gradient-to-l from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 dark:border-indigo-600/[0.4] px-4 border border-salte-400 rounded-full cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600/[0.8]"
                        >
                            <ChainSwitcher />
                        </span>
                        <p class="flex items-center text-indigo-400 uppercase">
                            {#await $nativeBalance}
                                ...
                            {:then}
                                {$nativeBalance > 0
                                    ? $nativeBalance.toFixed(8)
                                    : $nativeBalance.toFixed(2)}

                                <span class="text-sm ml-1">
                                    {chainsList[$currentChainID].sym}
                                </span>
                            {/await}
                        </p>
                    </div>
                </div>
                <button
                    on:click={handleSignOut}
                    class="flex justify-between items-center text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 px-1 py-2 sm:px-4 rounded-full"
                >
                    <span class="hidden sm:inline-block">
                        {$currentUser
                            .get("ethAddress")
                            .substr(0, 5)}...{$currentUser
                            .get("ethAddress")
                            .substr(-4)}
                    </span>
                    <span class="mdso ml-2">logout</span>
                </button>
            {:else}
                <button
                    on:click={handleSignIn}
                    class="flex items-center text-white font-bold bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2 rounded-full hover:bg-gradient-to-b hover:shadow-lg transition duration-0 hover:duration-150"
                >
                    <img
                        src="metamask.png"
                        class="w-6 mr-2"
                        alt="login with metamask"
                    />
                    Sign in
                    <span class="hidden sm:inline-block ml-1"
                        >with MetaMask</span
                    >
                </button>
            {/if}
        </div>
    </div>
</div>
