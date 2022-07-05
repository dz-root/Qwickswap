<script>
    import { goto } from "$app/navigation";

    export let isSuccess;
    export let message;
    export let url;
    export let name;

    function close() {
        isSuccess = true;
        goto("/");
    }
</script>

<div
    on:click={() => close()}
    class:hidden={isSuccess}
    class="absolute flex items-center justify-center w-full h-full bg-slate-900/75 z-20"
>
    <div
        class="flex flex-col items-center justify-center w-11/12 sm:w-3/5  md:w-2/5 xl:w-1/5 p-5 bg-white dark:bg-slate-900 border border-green-500 dark:border-indigo-900 rounded-xl"
    >
        <div class="flex w-full justify-end">
            <button
                class="mdso text-sm rounded-full p-1 dark:text-slate-600 bg-slate-200 dark:bg-slate-800 hover:dark:bg-indigo-900"
                on:click={() => close()}>close</button
            >
        </div>
        <lottie-player
            src="https://assets1.lottiefiles.com/packages/lf20_jbrw3hcz.json"
            background="transparent"
            speed="1"
            class="-mt-5 -mb-5"
            autoplay
        />
        <p class="w-full font-bold text-left dark:text-slate-200">TxID:</p>
        <p class="w-full font-bold text-sm text-slate-400 break-words mb-2">
            {message}
        </p>
        <!--
           <a
                href={url}
                class="flex items-center w-full bg-green-500 rounded-xl px-5 py-3 font-bold text-white mt-4"
            >
                <span class="mdso mr-2">search</span>
                View on {name}
            </a>
       -->
    </div>
</div>
