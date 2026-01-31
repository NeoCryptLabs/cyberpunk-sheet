{{/*
Expand the name of the chart.
*/}}
{{- define "player-sheet.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "player-sheet.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "player-sheet.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "player-sheet.labels" -}}
helm.sh/chart: {{ include "player-sheet.chart" . }}
{{ include "player-sheet.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "player-sheet.selectorLabels" -}}
app.kubernetes.io/name: {{ include "player-sheet.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
API labels
*/}}
{{- define "player-sheet.api.labels" -}}
{{ include "player-sheet.labels" . }}
app.kubernetes.io/component: api
{{- end }}

{{- define "player-sheet.api.selectorLabels" -}}
{{ include "player-sheet.selectorLabels" . }}
app.kubernetes.io/component: api
{{- end }}

{{/*
Web labels
*/}}
{{- define "player-sheet.web.labels" -}}
{{ include "player-sheet.labels" . }}
app.kubernetes.io/component: web
{{- end }}

{{- define "player-sheet.web.selectorLabels" -}}
{{ include "player-sheet.selectorLabels" . }}
app.kubernetes.io/component: web
{{- end }}

{{/*
MongoDB connection string
*/}}
{{- define "player-sheet.mongodbUri" -}}
{{- if .Values.mongodb.enabled }}
mongodb://root:{{ .Values.secrets.mongodbRootPassword }}@{{ include "player-sheet.fullname" . }}-mongodb:27017/{{ .Values.mongodb.auth.database }}?authSource=admin
{{- else }}
{{ .Values.externalMongodb.uri }}
{{- end }}
{{- end }}
