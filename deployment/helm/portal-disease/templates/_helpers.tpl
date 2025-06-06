{{/*
Expand the name of the chart.
*/}}
{{- define "portal-disease.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "portal-disease.fullname" -}}
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

{{- define "portal-disease.fullversionname" -}}
{{- if .Values.istio.enable }}
{{- $name := include "portal-disease.fullname" . }}
{{- $version := regexReplaceAll "\\.+" .Chart.Version "-" }}
{{- printf "%s-%s" $name $version | trunc 63 }}
{{- else }}
{{- include "portal-disease.fullname" . }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "portal-disease.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "portal-disease.labels" -}}
helm.sh/chart: {{ include "portal-disease.chart" . }}
{{ include "portal-disease.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- with .Values.customLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "portal-disease.selectorLabels" -}}
{{ if .Values.istio.enable -}}
app: {{ include "portal-disease.name" . }}
version: {{ .Chart.AppVersion | quote }}
{{ end -}}
app.kubernetes.io/name: {{ include "portal-disease.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Deployment labels
*/}}
{{- define "portal-disease.deploymentLabels" -}}
{{- with .Values.deploymentLabels }}
{{ toYaml . }}
{{- end }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
{{- define "portal-disease.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "portal-disease.fullversionname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
