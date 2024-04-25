ARG SPA_TO_HTTP_VERSION="1.0.6"


FROM devforth/spa-to-http:${SPA_TO_HTTP_VERSION} AS base

SHELL [ "/bin/sh", "-eu", "-c" ]

ARG USER="user"
ARG HOME="/app"
ARG UID="1000"
ARG GID="1000"
RUN \
  addgroup --gid "${GID}" "${USER}" \
  ; adduser --disabled-password --gecos "" --home "${HOME}" --ingroup "${USER}" --uid "${UID}" "${USER}"

ENV PORT="5137"
ENV DIRECTORY="${HOME}/public"
ENV SPA_MODE="true"
ENV CACHE="true"
ENV CACHE_CONTROL_MAX_AGE="-1"
ENV LOG_PRETTY="true"

USER ${USER}
EXPOSE 5137/tcp
WORKDIR ${HOME}
COPY dist public
