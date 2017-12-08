defmodule DemoWeb.TimelineController do
  use DemoWeb, :controller

  def timeline(conn, params) do
    name = params["name"]
    render(conn, "timeline.html", %{who: name})
  end
end