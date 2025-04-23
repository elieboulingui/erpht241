// components/BodyNotification.tsx
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, CircleAlert, FileText, Shield, Users } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "./NotificationContext"
import React from "react"

export default function BodyNotification() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  function extractOrganisationId(url: string): string | null {
    const match = url.match(/\/listing-organisation\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  const getNotificationIcon = (type: 'task' | 'note' | 'organization' | 'access' | 'role') => {
    switch (type) {
      case 'task': return <CircleAlert className="h-4 w-4 text-blue-500" />
      case 'note': return <FileText className="h-4 w-4 text-green-500" />
      case 'organization': return <Users className="h-4 w-4 text-purple-500" />
      case 'access': return <Shield className="h-4 w-4 text-orange-500" />
      case 'role': return <CircleAlert className="h-4 w-4 text-yellow-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
        <DropdownMenuLabel className="flex justify-between items-center px-4 py-3">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={markAllAsRead}>
              Marquer tout comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <DropdownMenuItem 
                  className={`flex gap-3 p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    {notification.sender ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.sender.avatar} />
                        <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))
          )}
        </ScrollArea>

        <Link href={`/listing-organisation/${extractOrganisationId(window.location.href) || ''}/notification`}>
          <DropdownMenuItem className="justify-center py-3 text-sm font-medium cursor-pointer">
            Voir toutes les notifications
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}