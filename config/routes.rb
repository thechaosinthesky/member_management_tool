Rails.application.routes.draw do
  root 'teams#index'

  resources :projects do
    resources :members
  end
  resources :members do
    resources :projects
  end
  resources :teams do
    resources :members
  end

  get '/styles', to: 'application#styles'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
