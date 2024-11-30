'use client'

import * as React from "react"
import Image from "next/image"
import { Connector, useConnect, useDisconnect } from "@starknet-react/core"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wallet, X } from 'lucide-react'
import { motion } from "framer-motion"

const imageLoader = ({ src }: { src: string }) => src

interface WalletButtonProps {
  name: string
  alt: string
  src: string
  connector: Connector
}

const WalletButton: React.FC<WalletButtonProps> = ({ name, alt, src, connector }) => {
  const { connect } = useConnect()
  const isSvg = src?.startsWith("<svg")

  const handleConnectWallet = () => {
    connect({ connector })
    localStorage.setItem("lastUsedConnector", connector.name)
  }

  return (
    <motion.button
      className="bg-gradient-to-r from-blue-50 to-indigo-500 dark:from-blue-900 dark:to-indigo-900 
                 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800 dark:hover:to-indigo-800 
                 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 flex items-center 
                 space-x-4 w-full border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
      onClick={handleConnectWallet}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-10 w-10 rounded-full overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner">
        {isSvg ? (
          <div
            className="h-8 w-8"
            dangerouslySetInnerHTML={{ __html: src ?? "" }}
          />
        ) : (
          <Image
            alt={alt}
            loader={imageLoader}
            unoptimized
            src={src}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        )}
      </div>
      <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-100">{name}</span>
    </motion.button>
  )
}

const ConnectModal: React.FC = () => {
  const { connectors } = useConnect()

  const filteredConnectors = connectors.filter((connector) =>
    connector.name.toLowerCase()
  )

  return (
    <DialogContent className="sm:max-w-[550px] bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Connect a Wallet</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredConnectors.map((connector, index) => (
            <WalletButton
              key={connector.id || index}
              src={typeof connector.icon === 'object' ? connector.icon.light : connector.icon}
              name={connector.name}
              connector={connector}
              alt={`${connector.name} icon`}
            />
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}

interface ConnectButtonProps {
  text?: string
  className?: string
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  text = "Connect Wallet",
  className = "",
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}>
          <Wallet className="mr-2 h-4 w-4" />
          {text}
        </Button>
      </DialogTrigger>
      <ConnectModal />
    </Dialog>
  )
}

const DisconnectButton: React.FC = () => {
  const { disconnect } = useDisconnect({})
  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDisconnect}
      className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      <X className="h-4 w-4 mr-2" />
      Disconnect
    </Button>
  )
}

export { ConnectButton, DisconnectButton }

