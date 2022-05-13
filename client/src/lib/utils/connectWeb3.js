const connectWeb3 = () => {
    try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        /* on récupère le tableau des comptes sur le metamask du user */
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        /* Création de l'objet de contrat avec l'abi, le deployedNetwork et son address  */
        const instance = new web3.eth.Contract(Voting.abi, deployedNetwork && deployedNetwork.address);

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance });

        let account = this.state.accounts[0];

        this.setState({
            userAddress: account.slice(0, 6) + '...' + account.slice(38, 42)
        });

        // Check if the user is the owner
        const owner = await instance.methods.owner().call();
        if (account === owner) {
            this.setState({
                isOwner: true
            });
        }
    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
    }
}

export default connectWeb3;
