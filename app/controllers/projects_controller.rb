class ProjectsController < ApplicationController
  before_action :set_project, only: %i[ show edit update destroy ]

  # GET /projects or /projects.json
  def index
    if params[:member_id].present?

      # Simpulate load time in dev mode
      sleep 0.5 if Rails.env.development? || Rails.env.demo?

      @member = Member.find(params[:member_id])
      @projects = @member.projects
    else
      @projects = Project.all
    end
  end

  # GET /projects/1 or /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects or /projects.json
  def create
    @project = Project.new(project_params)

    respond_to do |format|
      if @project.save
        flash[:success] = "Project was successfully created."
        format.html { redirect_to project_url(@project), notice: "Project was successfully created." }
        format.json { render :show, status: :created, location: @project }
      else
        flash[:error] = "There was an error creating the project."
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1 or /projects/1.json
  def update
    if params[:member_id].present?
      @member = Member.find(params[:member_id])
      already_exists = @project.members.where(:id => @member.id).present?

      respond_to do |format|
        if already_exists
          flash[:warning] = "Project already exists for the member."
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: [], status: :unprocessable_entity }
        else
          @project.members << @member
          if @project.save
            flash[:success] = "Project has been added for the member."
            format.html { redirect_to member_url(@project), notice: "Project was successfully updated." }
            format.json { render :show, status: :ok, location: @project }
          else
            flash[:error] = "There was an error adding the project."
            format.html { render :edit, status: :unprocessable_entity }
            format.json { render json: @project.errors, status: :unprocessable_entity }
          end
        end
      end
    else
      respond_to do |format|
        if @project.update(project_params)
          flash[:success] = "Project was successfully updated."
          format.html { redirect_to project_url(@project), notice: "Project was successfully updated." }
          format.json { render :show, status: :ok, location: @project }
        else
          flash[:error] = "There was an error updating the project."
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @project.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # DELETE /projects/1 or /projects/1.json
  def destroy
    if params[:member_id].present?
      @member = Member.find(params[:member_id])
      @project.members.delete(@member.id)
      if @project.save
        flash[:success] = "Project has been removed for the member."
        respond_to do |format|
          format.json { head :no_content }
        end
      end
    else
      @project.destroy
      respond_to do |format|
        flash[:success] = "Project was successfully deleted."
        format.html { redirect_to projects_url, notice: "Project was successfully destroyed." }
        format.json { head :no_content }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def project_params
      params.require(:project).permit(:name, :description, :member_id)
    end
end
