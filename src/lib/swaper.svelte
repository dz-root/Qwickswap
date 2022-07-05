<script>
    import {
        currentUser,
        currentChain,
        currentChainID,
        slippage,
    } from "./stores.js";
    import Slippage from "./slippage.svelte";
    import SuccesSwap from "./successSwap.svelte";

    const web3 = new Web3();
    /*
    let customtokens = {
        0x4ee438be38f8682abb089f2bfea48851c5e71eaf: {
            address: "0x4ee438be38f8682abb089f2bfea48851c5e71eaf",
            decimals: 18,
            logoURI: "https://cdn.cryptonovae.com/Cryptonovae_Icon_200x200.png",
            name: "Cryptonovae",
            symbol: "YAE",
        },
    };*/
    $: currentUser;
    $: currentChainID;
    $: currentTrade = {};
    $: isSuccess = true;

    let chainsList = {
        "0x1": {
            id: "1",
            name: "eth",
            sym: "eth",
            logo: "eth.png",
            explorer_name: "Etherscan",
            explorer_url: "https://etherscan.io/tx/",
            pool: "",
        },
        "0x38": {
            id: "56",
            name: "bsc",
            sym: "bnb",
            logo: "bsc.png",
            explorer_name: "BscScan",
            explorer_url: "https://bscscan.com/tx/",
            pool: "",
        },
        "0x89": {
            id: "137",
            name: "polygon",
            sym: "matic",
            logo: "polygon.png",
            pool: "",
            explorer_name: "PolygoSscan",
            explorer_url: "https://polygonscan.com/tx/",
        },
    };

    let tokens,
        txHash,
        closeTokenModal = true,
        currentSelectSide,
        slippageVal = $slippage;

    function errorHandle(_error, message) {
        document.getElementById("error").classList.remove("hidden");
        if (error.length > 0) {
            document.getElementById("error_message").innerHTML =
                "<b>" + message + "</b><br>" + _error.message;
        } else {
            document.getElementById("error_message").innerHTML =
                "<b>" + message + "</b>";
        }

        setTimeout(() => {
            document.getElementById("error").classList.add("hidden");
        }, 4000);
    }

    async function auth() {
        if ($currentUser) return;
        // Authenticate with MetaMask (Moralis API)
        const user = await Moralis.authenticate({
            signingMessage: "Sign in to QwickSwap",
        });
        // Update value of current user store
        $currentUser = user;
        chainId = await Moralis.chainId;
    }

    function _openTokenModal(side) {
        tokenList();
        currentSelectSide = side;
        closeTokenModal = false;
    }

    function _closeTokenModal() {
        closeTokenModal = !closeTokenModal;
        resetSearch();
    }

    function resetSearch() {
        const searchInput = document.getElementById("search_token");
        searchInput.value = "";
    }

    async function tokenList() {
        if ($currentUser) {
            const assets = await Moralis.Plugins.oneInch.getSupportedTokens({
                chain: $currentChain,
            });

            if (currentTrade.from) {
                delete tokens[currentTrade.from.address];
            } else {
                tokens = assets.tokens;
            }
            //Object.assign(tokens, customtokens);
            const token_list = document.getElementById("token_list");

            for (const address in tokens) {
                let token = tokens[address];

                let token_row = document.createElement("div");
                let html = `
                    <img src="${token.logoURI}" class="w-8 h-8 mr-2 rounded-full" title="Swap ${token.symbol}" alt="Swap ${token.symbol}" onerror="this.src='choose_token.png'" />
                    <div>
                        <p class="txtvalue font-bold text-xs">${token.name}</p>
                        <p class="symvalue text-xs">${token.symbol}</p>
                    </div>
                `;

                token_row.setAttribute("data-address", address);
                token_row.setAttribute("data-symbol", token.symbol);
                token_row.setAttribute(
                    "class",
                    "token-item flex w-full items-center cursor-pointer px-5 py-2 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                );

                token_row.innerHTML = html;
                token_list.appendChild(token_row);
                token_row.onclick = () => selectToken(address);
            }
        }
    }

    function searchToken() {
        let search = document.getElementById("search_token");
        let filter = search.value.toUpperCase();
        let token_list = document.getElementById("token_list");
        let token_section = token_list.getElementsByTagName("div");

        for (let i = 0; i < token_section.length; i++) {
            let a = token_section[i].querySelector("div > .txtvalue");
            let b = token_section[i].querySelector("div > .symvalue");
            let txtValue = a.textContent || a.innerText;
            let symValue = b.textContent || b.innerText;
            if (
                txtValue.toUpperCase().indexOf(filter) > -1 ||
                symValue.toUpperCase().indexOf(filter) > -1
            ) {
                token_section[i].classList.remove("hidden");
            } else {
                token_section[i].classList.add("hidden");
            }
        }
    }

    function selectToken(address) {
        _closeTokenModal();
        currentTrade[currentSelectSide] = tokens[address];
        displayChoice();
        getQuote();
        getPrice();
        //console.log(currentTrade);
    }

    function displayChoice() {
        if (
            currentTrade.from &&
            currentTrade.to &&
            currentTrade.from.address == currentTrade.to.address
        ) {
            errorHandle([], "Can't swap to the same token");
        }
        if (currentTrade.from) {
            document.getElementById("from_token_img").src =
                currentTrade.from.logoURI;
            document.getElementById("from_token_symbol").innerHTML =
                currentTrade.from.symbol;
            document.getElementById("from_token_name").innerHTML =
                currentTrade.from.name;
        }
        if (currentTrade.to) {
            document.getElementById("to_token_img").src =
                currentTrade.to.logoURI;
            document.getElementById("to_token_symbol").innerHTML =
                currentTrade.to.symbol;
            document.getElementById("to_token_name").innerHTML =
                currentTrade.to.name;
        }
    }

    function reversChoice() {
        if (currentTrade.from && currentTrade.to) {
            let tempcurrentTrade = {
                from: currentTrade.to,
                to: currentTrade.from,
            };
            currentTrade = tempcurrentTrade;
            document.getElementById("from_amount").value =
                document.getElementById("to_amount").value;
            document.getElementById("to_amount").value =
                document.getElementById("from_amount").value;
            displayChoice();
            getQuote();
            getPrice();
        }
    }

    async function getQuote() {
        if (!currentTrade.from || !currentTrade.to) return;
        let amount = Number(
            document.getElementById("from_amount").value *
                10 ** currentTrade.from.decimals
        );

        const quote = await Moralis.Plugins.oneInch.quote({
            chain: $currentChain,
            fromTokenAddress: currentTrade.from.address,
            toTokenAddress: currentTrade.to.address,
            amount: amount,
        });

        document.getElementById("to_amount").value = (
            quote.toTokenAmount /
            10 ** quote.toToken.decimals
        ).toFixed(6);
        document.getElementById("gas_amount").innerHTML = quote.estimatedGas;
        getPrice();
    }

    async function getPrice() {
        let tokenPrice;
        let toUSD;
        if (
            currentTrade.from.address !=
            "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        ) {
            tokenPrice = await Moralis.Web3API.token.getTokenPrice({
                address: currentTrade.from.address,
                chain: $currentChain,
                exchange: "",
            });

            toUSD = tokenPrice.usdPrice;
        } else {
            let nativeAddr = "";
            $currentChain == "bsc"
                ? (nativeAddr = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
                : "";
            $currentChain == "eth"
                ? (nativeAddr = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
                : "";
            $currentChain == "polygon"
                ? (nativeAddr = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270")
                : "";
            tokenPrice = await Moralis.Web3API.token.getTokenPrice({
                address: nativeAddr,
                chain: $currentChain,
            });
            toUSD = tokenPrice.usdPrice;
        }

        let amount = Number(document.getElementById("from_amount").value);
        document.getElementById("token_price").innerHTML = toUSD.toFixed(6);
        document.getElementById("esimated_price").innerHTML = (
            toUSD * amount
        ).toFixed(2);
    }

    async function trySwap() {
        let userAddress = Moralis.User.current().get("ethAddress");
        let amount = Number(
            web3.utils.toWei(document.getElementById("from_amount").value)
        );
        try {
            if (!currentTrade.from.symbol !== chainsList[$currentChainID].sym) {
                const allowance = await Moralis.Plugins.oneInch.hasAllowance({
                    chain: $currentChain,
                    fromTokenAddress: currentTrade.from.address,
                    fromAddress: userAddress,
                    amount: amount,
                });
                //console.log(`User has allowance: ${allowance}`);

                if (allowance == false) {
                    document.getElementById("swap_btn").textContent =
                        "Enable " + currentTrade.from.symbol;
                    await Moralis.Plugins.oneInch.approve({
                        chain: $currentChain,
                        tokenAddress: currentTrade.from.address,
                        fromAddress: userAddress,
                    });
                }
            }
        } catch (e) {
            errorHandle(e, "Request rejected");
        }

        swap(amount, userAddress);
    }

    async function swap(_amount, _userAddress) {
        // + chain.id +
        const url =
            "https://api.1inch.exchange/v4.0/" +
            chainsList[$currentChainID].id +
            "/swap";

        fetch(
            url +
                "?fromTokenAddress=" +
                currentTrade.from.address +
                "&toTokenAddress=" +
                currentTrade.to.address +
                "&amount=" +
                _amount +
                "&fromAddress=" +
                _userAddress +
                "&referrerAddress=0xb126820abe891196c5145E4d1Ad089BAc50424FC&fee=2&slippage=" +
                slippageVal
        )
            .then((res) => res.json())
            .then((res) => {
                let param = {
                    data: res.tx.data,
                    from: res.tx.from,
                    gas: web3.utils.toHex(res.tx.gas).toString(),
                    gasPrice: web3.utils.toHex(res.tx.gasPrice).toString(),
                    to: res.tx.to,
                    value: web3.utils.toHex(res.tx.value).toString(),
                };

                ethereum
                    .request({
                        method: "eth_sendTransaction",
                        params: [param],
                    })
                    .then((_txHash) => {
                        isSuccess = false;
                        //console.log(`param: ${txHash}`);
                        txHash = _txHash;
                    })
                    .catch((error) => errorHandle(error, "Cancelled"));
            })
            .catch((error) => errorHandle(error, "Insufficient balance"));
    }
</script>

<SuccesSwap {isSuccess} message={txHash} />
<div
    class="swap-box flex flex-col bg-white/[0.3] dark:bg-slate-900/[0.4] w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 relative border dark:border-slate-800 p-4 rounded-xl shadow-lg shadow-slate-200/75 dark:shadow-slate-900"
>
    <div class="flex mb-2">
        <h1
            class="flex-1 text-sm md:text-base font-semibold text-slate-400/[0.8] text-slate-500/[0.8] mb-2"
        >
            Change tokens in an instant
        </h1>
        <Slippage />
    </div>

    <!-- Token from-->
    <div
        class="token-list w-full flex flex-col rounded-xl p-3 bg-slate-50/[0.3] dark:bg-slate-900/[0.3] border dark:border-slate-800 border-slate-200"
    >
        <div
            class="tag flex justify-between text-slate-400 dark:text-slate-500 text-xs mb-1"
        >
            From
            <div class="flex space-x-1">
                <span>Current Price</span> <span id="token_price" />
            </div>
        </div>

        <div class="w-full flex items-center space-x-2">
            <div
                on:click={() => _openTokenModal("from")}
                class="group w-full flex items-center justify-between rounded-full cursor-pointer border hover:border-2 border-slate-300 dark:border-slate-700 hover:border-yellow-500 dark:hover:border-yellow-500/[0.5] px-2 transition ease-in-out delay-50"
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
                        class="text-slate-500 font-bold hover-group:text-yellow-500"
                        >From</span
                    >
                </div>
                <span class="mdso text-slate-400 group-hover:text-yellow-500"
                    >keyboard_arrow_down</span
                >
            </div>
            <input
                on:keyup={() => getPrice()}
                on:keyup={() => getQuote()}
                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                id="from_amount"
                disabled={$currentUser ? false : true}
                class="w-full grow text-right text-xl font-bold px-2 py-2 bg-slate-50/[0.01] dark:bg-slate-900/[0.01] dark:text-white rounded-md focus:outline-none focus:border-sky-500 focus:ring-sky-500 dark:focus:border-sky-900 dark:focus:ring-indigo-900 focus:ring-1"
                placeholder="0.00"
            />
        </div>
        <div class="token_info flex my-2">
            <div class="flex-1 text-slate-400 text-xs font-bold">
                <span id="from_token_name" />
            </div>
            <div class="text-slate-400 dark:text-slate-500 text-xs">
                $ <span id="esimated_price" />
            </div>
        </div>
    </div>

    <!-- Reverse token -->
    <div class="flex justify-center mb-3 -mt-3">
        <div
            on:click={() => reversChoice()}
            class="flex justify-center items-center text-indigo-300 bg-indigo-50 dark:text-indigo-100 dark:bg-gradient-to-r dark:from-sky-500 dark:to-indigo-500 w-8 h-8 border border-indigo-200 dark:border-none rounded-full cursor-pointer hover:bg-indigo-300 hover:text-white hover:rotate-180 ease-in-out duration-300"
        >
            <span class="mdso text-lg">arrow_downward</span>
        </div>
    </div>

    <!-- Token to-->
    <div
        class="token-list w-full flex flex-col rounded-xl p-3 mb-8 bg-slate-50/[0.03] dark:bg-slate-900/[0.3] border dark:border-slate-800 border border-slate-200"
    >
        <div class="tag text-slate-500 text-xs mb-1">To (estimated)</div>
        <div class="w-full flex space-x-2 items-center">
            <div
                on:click={() => _openTokenModal("to")}
                class="group w-full flex items-center justify-between rounded-full cursor-pointer border hover:border-2 border-slate-300 px-2 dark:border-slate-700 hover:border-fuchsia-500/[0.5] dark:hover:border-fuchsia-800/[0.5] transition ease-in-out delay-50"
            >
                <div class="flex items-center">
                    <img
                        id="to_token_img"
                        src="swap_to.png"
                        class="w-6 h-6 m-2"
                        alt="swap to"
                    />
                    <span id="to_token_symbol" class="text-slate-500 font-bold"
                        >To</span
                    >
                </div>
                <span class="mdso text-slate-400 group-hover:text-fuchsia-500"
                    >keyboard_arrow_down</span
                >
            </div>
            <input
                type="number"
                id="to_amount"
                disabled
                class="w-full grow text-right text-xl font-bold px-2 py-3 bg-slate-50/[0.01] dark:bg-slate-900/[0.01] dark:text-white rounded-r-md"
                placeholder="0.00"
            />
        </div>
        <div class="token_info flex my-2">
            <div class="flex-1 text-slate-400 text-xs font-bold">
                <span id="to_token_name" />
            </div>
            <div class="tag text-slate-400 dark:text-slate-500 text-xs">
                Estimated Gas: --<span id="gas_amount" />
            </div>
        </div>
    </div>

    <div id="status" />
    {#if $currentUser == "loading"}
        <p>Loading…</p>
    {:else if $currentUser}
        <!-- Token List-->
        <div
            id="modal"
            class:hidden={closeTokenModal}
            class="w-full h-full absolute top-0 left-0 rounded-xl bg-white/[0.9] dark:bg-slate-900/[0.95] dark:text-slate-400"
        >
            <div
                class="modal-header flex items-center justify-between px-4 py-3"
            >
                <p
                    on:click={() => _closeTokenModal()}
                    class="mr-2 cursor-pointer text-slate-400 hover:text-indigo-500 dark:text-slate-600 dark:hover:text-sky-500"
                >
                    <span class="mdso">arrow_back</span>
                </p>
                <p
                    class="font-semibold text-sm text-slate-400 dark:text-slate-600 mr-2"
                >
                    Im looking for
                </p>
                <input
                    type="text"
                    on:keyup={() => searchToken()}
                    id="search_token"
                    class="flex-1  border border-slate-300 dark:border-slate-800 py-2 px-4 rounded-full dark:text-indigo-200 dark:bg-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-indigo-300 dark:focus:border-indigo-900 dark:focus:ring-indigo-900 focus:ring-1"
                    placeholder="Search..."
                />
            </div>
            <div id="token_list" class="w-full h-5/6 overflow-auto" />
        </div>
        <button
            id="swap_btn"
            class="flex items-center justify-center font-bold text-slate-400 dark:text-sky-500/[0.8] bg-white/[0.2] dark:bg-slate-900/[0.5] rounded-xl p-4 hover:bg-indigo-50 hover:text-indigo-500 shadow-lg shadow-indigo-400/[0.2] dark:shadow-sky-700/[0.2] dark:hover:shadow-indigo-700/[0.2] dark:hover:text-indigo-600 ease-in-out duration-200"
            on:click={() => trySwap()}
        >
            <span class="mdso mr-5">swap_horiz</span> Swap
        </button>
    {:else}
        <button
            id="swap_btn"
            class="flex items-center justify-center font-bold text-slate-400 bg-gradient-to-l from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border dark:border-slate-700 rounded-md p-4 hover:bg-indigo-600 hover:text-indigo-500 hover:bg-gradient-to-b shadow-md transition duration-0 hover:duration-150"
            on:click={() => auth()}
        >
            <span class="mdso mr-5">electrical_services</span> Conntect to Metamask
        </button>
    {/if}
</div>
