class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :logging, true

  get '/' do
    haml :index
  end

  get '/log' do
    haml :log
  end
end
