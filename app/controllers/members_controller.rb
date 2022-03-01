class MembersController < ApplicationController
  before_action :set_member, only: %i[ show edit update destroy ]

  # GET /members or /members.json
  def index
    if params[:team_id].present?
      
      # Simpulate load time in dev mode
      sleep 1.3 if Rails.env.development? || Rails.env.demo?

      @team = Team.find(params[:team_id])
      @members = @team.members
    elsif params[:project_id].present?

      # Simpulate load time in dev mode
      sleep 1.3 if Rails.env.development? || Rails.env.demo?

      @project = Project.find(params[:project_id])
      @members = @project.members
    else
      @members = Member.all
    end
  end

  # GET /members/1 or /members/1.json
  def show
  end

  # GET /members/new
  def new
    @member = Member.new
  end

  # GET /members/1/edit
  def edit
  end

  # POST /members or /members.json
  def create
    @member = Member.new(member_params)

    respond_to do |format|
      if @member.save
        flash[:success] = "Member was successfully created."
        format.html { redirect_to member_url(@member), notice: "Member was successfully created." }
        format.json { render :show, status: :created, location: @member }
      else
        flash[:error] = "There was an error creating the member."
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @member.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /members/1 or /members/1.json
  def update
    if params[:project_id].present?
      @project = Project.find(params[:project_id])
      already_exists = @member.projects.where(:id => @project.id).present?

      respond_to do |format|
        if already_exists
          flash[:warning] = "Member already exists in the project."
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: [], status: :unprocessable_entity }
        else
          @member.projects << @project
          if @member.save
            flash[:success] = "Member has been added to the project."
            format.html { redirect_to member_url(@member), notice: "Member was successfully updated." }
            format.json { render :show, status: :ok, location: @member }
          else
            flash[:error] = "There was an error adding the member to the project."
            format.html { render :edit, status: :unprocessable_entity }
            format.json { render json: @member.errors, status: :unprocessable_entity }
          end
        end
      end
    else
      respond_to do |format|
        if @member.update(member_params)
          flash[:success] = "Member was successfully updated."
          format.html { redirect_to member_url(@member), notice: "Member was successfully updated." }
          format.json { render :show, status: :ok, location: @member }
        else
          flash[:error] = "There was an error updating the member."
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @member.errors, status: :unprocessable_entity }
        end
      end
    end
  end

  # DELETE /members/1 or /members/1.json
  def destroy
    if params[:project_id].present?
      @project = Project.find(params[:project_id])
      @member.projects.delete(@project.id)
      if @member.save
        flash[:success] = "Member has been removed from the project."
        respond_to do |format|
          format.json { head :no_content }
        end
      end
    else
      @member.destroy
      respond_to do |format|
        flash[:success] = "Member was successfully deleted."
        format.html { redirect_to members_url, notice: "Member was successfully destroyed." }
        format.json { head :no_content }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_member
      @member = Member.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def member_params
      params.require(:member).permit(:first_name, :last_name, :city, :state, :country, :team_id, :project_id)
    end
end
