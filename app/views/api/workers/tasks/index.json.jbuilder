json.array!(@workable_tasks) do |task|
  json.task do
    json.id task.id
    json.title task.title
    json.location task.location
    json.description task.description
    json.creator task.creator.nickname
    json.creator_id task.creator.id
    json.datetime [task.date, task.interval]
    json.lat task.lat
    json.lng task.lng
  end
end