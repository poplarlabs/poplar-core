import SwiftUI
// Uncomment the following import when integrating with a web3 library
// import web3swift

struct ContentView: View {
    @State private var walletAddress: String = "Not connected"
    @State private var contractName: String = "N/A"

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Poplar Wallet")
                    .font(.largeTitle)
                    .padding()

                Text("Wallet Address: \(walletAddress)")
                    .padding()

                Button(action: {
                    connectWallet()
                }) {
                    Text("Connect Wallet")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }

                if walletAddress != "Not connected" {
                    Button(action: {
                        fetchContractName()
                    }) {
                        Text("Fetch Contract Name")
                            .padding()
                            .background(Color.green)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    Text("Contract Name: \(contractName)")
                        .padding()
                }

                Spacer()
            }
            .navigationTitle("Poplar Wallet")
        }
    }

    func connectWallet() {
        // Simulate wallet connection by assigning a dummy wallet address.
        // In a production app, integrate with WalletConnect or another wallet provider.
        walletAddress = "0x1234567890ABCDEF1234567890ABCDEF12345678"
    }

    func fetchContractName() {
        // Simulate a call to the smart contract's getName() function.
        // Ideally, use a library like web3swift to interact with your deployed contract.
        // Example (pseudocode):
        // let web3 = Web3(provider: ...)
        // let contract = web3.contract(abi, at: contractAddress, abiVersion: 2)!
        // let result = try? contract.method("getName", parameters: [])!.call()
        // contractName = result?["0"] as? String ?? "Unknown"

        contractName = "Poplar"
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
