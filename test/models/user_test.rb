# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  bio             :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  fname           :string           not null
#  lname           :string           not null
#  is_robot        :boolean          not null
#  wage            :integer          default(0), not null
#  skill           :integer
#

require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
