// src/components/AuditLog.jsx

"use client";

import React, { useState, useEffect } from "react";
import { User, Download, Home, FileText, Users } from "lucide-react";
import { useI18n } from "../../i18n/I18nContext";

const AuditLog = () => {
  const { t } = useI18n();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getActionInfo = (logEntry) => {
    const {
      action_type,
      model_name,
      model_verbose_name,
      object_repr,
      changes,
      actor_name,
    } = logEntry;

    const getModelIcon = (modelName) => {
      switch (modelName) {
        case "user":
        case "student":
          return User;
        case "application":
        case "заявка":
          return FileText;
        case "dormitory":
        case "общежитие":
          return Home;
        case "group":
        case "группа":
          return Users;
        default:
          return Download;
      }
    };

    const getActionColor = (actionType) => {
      switch (actionType) {
        case "Создание":
          return "text-green-500";
        case "Изменение":
          return "text-blue-500";
        case "Удаление":
          return "text-red-500";
        default:
          return "text-gray-500";
      }
    };

    const icon = getModelIcon(model_name);
    const color = getActionColor(action_type);
    const title = `${action_type} ${model_verbose_name || model_name || t("auditLog.title")}`;

    let desc = object_repr || t("auditLog.error");
    if (action_type === "Изменение" && changes && Object.keys(changes).length > 0) {
      const fields = Object.keys(changes);
      desc += fields.length === 1
        ? ` - изменено поле "${fields[0]}"`
        : ` - изменено полей: ${fields.length}`;
    }
    if (actor_name && actor_name !== "Система") {
      desc += ` (${actor_name})`;
    }

    return { icon, title, desc, color };
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const resp = await fetch("http://127.0.0.1:8000/api/v1/audit-log/");
      if (!resp.ok) throw new Error(resp.status);
      const data = await resp.json();
      const formatted = data.results.map((entry) => {
        const info = getActionInfo(entry);
        return {
          id: entry.id,
          ...info,
          timestamp: entry.timestamp,
          modelName: entry.model_verbose_name || entry.model_name,
        };
      });
      setActions(formatted);
      setError(null);
    } catch {
      setError(t("auditLog.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    const iv = setInterval(fetchAuditLogs, 30000);
    return () => clearInterval(iv);
  }, []);

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = Date.now();
    const diffM = Math.floor((now - date) / 60000);
    if (diffM < 1) return t("auditLog.time.justNow");
    if (diffM < 60) return t("auditLog.time.minutesAgo", { count: diffM });
    if (diffM < 1440) return t("auditLog.time.hoursAgo", { count: Math.floor(diffM / 60) });
    return date.toLocaleDateString(
      t("auditLog.time.dateOptions.locale"),
      {}
    );
  };

  if (loading) {
    return (
      <div className="admin-last-actions">
        <div className="admin-last-title">{t("auditLog.title")}</div>
        <div className="admin-last-list">
          <div className="flex items-center justify-center p-8">
            <div className="text-gray-500">{t("auditLog.loading")}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-last-actions">
        <div className="admin-last-title">{t("auditLog.title")}</div>
        <div className="admin-last-list">
          <div className="flex items-center justify-center p-8">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-last-actions">
      <div className="admin-last-title">{t("auditLog.title")}</div>
      <div className="admin-last-list">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div className="admin-action" key={action.id}>
              <div className={`admin-action-icon ${action.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="admin-action-title">{action.title}</div>
                <div className="admin-action-desc">{action.desc}</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray-400">
                    {formatTimestamp(action.timestamp)}
                  </div>
                  {action.modelName && (
                    <>
                      <span className="text-xs text-gray-300">
                        {t("auditLog.modelSeparator")}
                      </span>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {action.modelName}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditLog;
