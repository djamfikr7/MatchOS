"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
            const socketInstance = io("http://localhost:3001", {
                auth: {
                    token: `Bearer ${token}`,
                },
                reconnection: true,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
            })

            socketInstance.on("connect", () => {
                setIsConnected(true)
                console.log("Socket connected")
            })

            socketInstance.on("disconnect", () => {
                setIsConnected(false)
                console.log("Socket disconnected")
            })

            socketInstance.on("connect_error", (error) => {
                console.warn("WebSocket connection error:", error.message)
                setIsConnected(false)
            })

            socketInstance.on("matchFound", (data: any) => {
                toast.success("New Match Found!", {
                    description: `Provider ${data.providerId} matches your request!`,
                    action: {
                        label: "View",
                        onClick: () => console.log("Navigate to match"),
                    },
                })
            })

            setSocket(socketInstance)

            return () => {
                socketInstance.disconnect()
            }
        } catch (error) {
            console.error("Failed to initialize WebSocket:", error)
            setIsConnected(false)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
