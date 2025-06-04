"use client"

import { useState, useEffect } from "react"
import { User, Download, Home, FileText, Users } from "lucide-react"

const AuditLog = () => {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Маппинг типов действий на иконки и заголовки
  const getActionInfo = (logEntry) => {
    const { action_type, model_name, model_verbose_name, object_repr, changes, actor_name } = logEntry

    // Определяем иконку на основе модели
    const getModelIcon = (modelName) => {
      switch (modelName) {
        case "user":
        case "student":
          return User
        case "application":
        case "заявка":
          return FileText
        case "dormitory":
        case "общежитие":
          return Home
        case "group":
        case "группа":
          return Users
        default:
          return Download
      }
    }

    // Определяем цвет на основе типа действия
    const getActionColor = (actionType) => {
      switch (actionType) {
        case "Создание":
          return "text-green-500"
        case "Изменение":
          return "text-blue-500"
        case "Удаление":
          return "text-red-500"
        default:
          return "text-gray-500"
      }
    }

    const icon = getModelIcon(model_name)
    const color = getActionColor(action_type)

    // Формируем заголовок
    const title = `${action_type} ${model_verbose_name || model_name || "объекта"}`

    // Формируем описание
    let desc = object_repr || "Неизвестный объект"

    // Добавляем информацию об изменениях для действий "Изменение"
    if (action_type === "Изменение" && changes && Object.keys(changes).length > 0) {
      const changedFields = Object.keys(changes)
      if (changedFields.length === 1) {
        desc += ` - изменено поле "${changedFields[0]}"`
      } else {
        desc += ` - изменено полей: ${changedFields.length}`
      }
    }

    // Добавляем информацию о том, кто выполнил действие
    if (actor_name && actor_name !== "Система") {
      desc += ` (${actor_name})`
    }

    return {
      icon,
      title,
      desc,
      color,
    }
  }

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://127.0.0.1:8000/api/v1/audit-log/")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Преобразуем данные из API в формат для отображения
      const formattedActions = data.results.map((logEntry) => {
        const actionInfo = getActionInfo(logEntry)
        return {
          id: logEntry.id,
          icon: actionInfo.icon,
          title: actionInfo.title,
          desc: actionInfo.desc,
          color: actionInfo.color,
          timestamp: logEntry.timestamp,
          actor: logEntry.actor_name,
          actionType: logEntry.action_type,
          modelName: logEntry.model_verbose_name || logEntry.model_name,
        }
      })

      setActions(formattedActions)
      setError(null)
    } catch (err) {
      console.error("Ошибка при загрузке логов:", err)
      setError("Не удалось загрузить логи аудита")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs()

    // Обновляем логи каждые 30 секунд
    const interval = setInterval(fetchAuditLogs, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "только что"
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ч назад`
    return date.toLocaleDateString("ru-RU")
  }

  if (loading) {
    return (
      <div className="admin-last-actions">
        <div className="admin-last-title">Последние действия</div>
        <div className="admin-last-list">
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">Загрузка...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-last-actions">
        <div className="admin-last-title">Последние действия</div>
        <div className="admin-last-list">
          <div className="flex items-center justify-center p-8">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-last-actions">
      <div className="admin-last-title">Последние действия</div>
      <div className="admin-last-list">
        {actions.map((action) => {
          const IconComponent = action.icon
          return (
            <div className="admin-action" key={action.id}>
              <div className={`admin-action-icon ${action.color}`}>
                <IconComponent size={24} />
              </div>
              <div className="flex-1">
                <div className="admin-action-title">{action.title}</div>
                <div className="admin-action-desc">{action.desc}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray-400">{formatTimestamp(action.timestamp)}</div>
                  {action.modelName && (
                    <>
                      <span className="text-xs text-gray-300">•</span>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{action.modelName}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AuditLog
