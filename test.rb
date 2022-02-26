
modules = []

File.readlines( "/users/calebloera//Desktop/wordsearch/test.txt" ).uniq.each() do |line|

    modules << /resolve '(.+?)'/.match( line )[1] + ": false,"
    
end

puts( modules.uniq )
