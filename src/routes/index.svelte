<script>
    import Swapper from "$lib/swaper.svelte";
</script>

<div
    id="error"
    class="flex w-full w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 mb-5 shadow-lg shadow-red-100/50 dark:shadow-slate-900/50 transition ease-in-out duration-300 hidden"
>
    <div
        class="flex w-full space-x-2 text-red-500 bg-white dark:bg-slate-900 p-4 border border-red-300 dark:border-red-500 rounded-md"
    >
        <span class="mdso">error</span>
        <p id="error_message" class="font-bold" />
    </div>
</div>

<Swapper />

<div
    class="tags w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 text-slate-400 leading-5 text-center italic mt-4"
>
    <h2 class="inline mr-2">Swap token on Ethereum Blockchain (ETH).</h2>
    <h2 class="inline mr-2">Swap token on Binance Smart Chain (BSC).</h2>
    <h2 class="inline mr-2">Swap token on Polygon Blockchain (Matic).</h2>
</div>
