// contexts/NotificationContext.tsx
"use client"

import React, { createContext, useContext, useState } from "react"

export type NotificationType = {
  id: string
  type: 'task' | 'note' | 'organization' | 'access' | 'role'
  title: string
  message: string
  read: boolean
  timestamp: Date
  sender?: {
    name: string
    avatar?: string
  }
}

const fixedNotifications: NotificationType[] = [
  {
    id: "1",
    type: "task",
    title: "Nouvelle tâche assignée",
    message: "Vous avez une nouvelle tâche à compléter.",
    read: false,
    timestamp: new Date(),
    sender: {
      name: "Alice",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: "2",
    type: "note",
    title: "Nouvelle note ajoutée",
    message: "Une nouvelle note a été ajoutée à votre projet.",
    read: true,
    timestamp: new Date(),
    sender: {
      name: "Bob",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    id: "3",
    type: "organization",
    title: "Invitation à une organisation",
    message: "Vous avez été invité à rejoindre GreenTech.",
    read: false,
    timestamp: new Date(),
  }
]

const NotificationContext = createContext<{
  notifications: NotificationType[]
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<NotificationType, "id" | "read">) => void
  removeNotification: (id: string) => void
  unreadCount: number
}>({
  notifications: [],
  setNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  addNotification: () => {},
  removeNotification: () => {},
  unreadCount: 0
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>(fixedNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const addNotification = (notification: Omit<NotificationType, "id" | "read">) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      timestamp: new Date()
    }
    setNotifications([newNotification, ...notifications])
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      setNotifications, 
      markAsRead, 
      markAllAsRead,
      addNotification,
      removeNotification,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)