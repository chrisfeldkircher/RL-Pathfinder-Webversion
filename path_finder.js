let sim;
let slider = undefined;
let thumb =  undefined;
let tooltip =  undefined;
let progress =  undefined;
let max_value = 0;
let checkbox1;
let discount = 0;
let slider1;
let learn_rate = 0;
let slider2;
let epsilon = 0;
let slider3;
let iterations = 0;
let slider4;
let action_limit = 0;
let slider5;
let episode_limit = 0;
let slider6;
let size = 0;
let slider7;
let pl_goal_distance = 0;
let slider8;
let p;
let p1;
let p2;
let p3;
let p4;
let p5;
let p6;
let p7;
let start_btn;
let stop_btn;
let reset_btn;
let load_grid_btn;
let save_grid_btn;
let load_qmap_btn;
let save_qmap_btn;
let save_input;
let load_input;
let clickInput;
let input;
let loaded_file = [];
let loaded_qmap = [];
let load_bol = false; 
let load_ai_bol = false;
let start_pos = [];
let goal = [];

// const container = document.querySelectorAll(".range-slider");

/*
for(var i = 0; i < container.length; i++)
{
	slider =  container[i].querySelector(".slider");
	thumb =  container[i].querySelector(".slider-thumb");
	tooltip =  container[i].querySelector(".tooltip");
	progress =  container[i].querySelector(".progress");
}*/

function setup() 
{
  createCanvas(displayWidth, displayHeight);
  //custom_slider();
  sim = new Simulation(15, 1350, 0.97, 0.8, 65, 600, 90, 10, false, [], [0,0], [0,0], false, []);

  slider1 = createSlider(0, 1, 0.97, 0.01);
  slider1.position(800, 160);
  slider1.style('width', '150px');
  p = createP(`Discount value: ${slider1.value()}`);
  p.style('font-size', '16px');
  p.position(800, 125);

  slider2 = createSlider(0, 1, 0.8, 0.01);
  slider2.position(800, 210);
  slider2.style('width', '150px');
  p1 = createP(`Learn rate: ${slider2.value()}`);
  p1.style('font-size', '16px');
  p1.position(800, 175);

  slider3 = createSlider(0, 300, 65, 1);
  slider3.position(800, 260);
  slider3.style('width', '150px');
  p2 = createP(`Epsilon (bigger = more exploration): ${slider3.value()}`);
  p2.style('font-size', '16px');
  p2.position(800, 225);

  slider4 = createSlider(0, 5000, 1350, 1);
  slider4.position(800, 310);
  slider4.style('width', '150px');
  p3 = createP(`Iteration (bigger = more exploration): ${slider4.value()}`);
  p3.style('font-size', '16px');
  p3.position(800, 275);
  
  slider5 = createSlider(0, 2000, 600, 1);
  slider5.position(800, 360);
  slider5.style('width', '150px');
  p4 = createP(`Action limit: ${slider5.value()}`);
  p4.style('font-size', '16px');
  p4.position(800, 325);

  slider6 = createSlider(0, 200, 90, 1);
  slider6.position(800, 410);
  slider6.style('width', '150px');
  p5 = createP(`Episode limit: ${slider6.value()}`);
  p5.style('font-size', '16px');
  p5.position(800, 375);

  slider7 = createSlider(0, 30, 18, 1);
  slider7.position(800, 460);
  slider7.style('width', '150px');
  p6 = createP(`Grid size: ${slider7.value()}`);
  p6.style('font-size', '16px');
  p6.position(800, 425);

  slider8 = createSlider(1, 30, 10, 1);
  slider8.position(800, 510);
  slider8.style('width', '150px');
  p7 = createP(`Min. Distance Start-Goal: ${slider8.value()}`);
  p7.style('font-size', '16px');
  p7.position(800, 475);

  checkbox1 = createCheckbox('Show a* Path', false);
  checkbox1.position(800, 80);
  //checkbox1 = document.querySelector(".cbox1");
  checkbox1.changed(checkbox1_change);

  start_btn = createButton('Start');
  start_btn.position(10, 250);
  start_btn.addClass('start_btn');
  start_btn.mousePressed(start);

  stop_btn = createButton('Stop');
  stop_btn.position(120, 250);
  stop_btn.addClass('stop_btn');
  stop_btn.mousePressed(stop);

  reset_btn = createButton('Apply Changes');
  reset_btn.position(30, 300);
  reset_btn.addClass('reset_btn');
  reset_btn.mousePressed(reset);

  save_grid_btn = createButton('Save grid');
  save_grid_btn.position(10, 400);
  save_grid_btn.addClass('save_grid_btn');
  save_grid_btn.mousePressed(save_map);

  save_qmap_btn = createButton('Save qmap');
  save_qmap_btn.position(140, 400);
  save_qmap_btn.addClass('save_qmap_btn');
  save_qmap_btn.mousePressed(save_map);

  load_grid_btn = createButton('Load grid');
  load_grid_btn.position(10, 450);
  load_grid_btn.addClass('load_grid_btn');
  load_grid_btn.mousePressed(load);

  load_qmap_btn = createButton('Load qmap');
  load_qmap_btn.position(140, 450);
  load_qmap_btn.addClass('load_qmap_btn');
  load_qmap_btn.mousePressed(load);
}

function checkbox1_change()
{
	if(checkbox1.checked()) sim.show_path = true;
	else sim.show_path = false;
}

function start()
{
	if(sim.stop == true) sim.stop = false;
}

function stop()
{
	sim.stop = true;
}

function reset()
{
	sim = new Simulation(size, iterations, discount, learn_rate, epsilon, action_limit, episode_limit, pl_goal_distance, false, [], [0,0], [0,0], false, []);
}

function save_map()
{
	if(this.elt.innerText == 'Save grid') 
	{
		save(sim.grid, 'map.csv', true);
	}
	else
	{
		console.log(JSON.stringify(sim.q_map));
		saveJSON(sim.q_map, 'qmap', true);
	}
}

function load() 
{
	if(this.elt.innerText == 'Load grid') 
	{
		input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv'
		input.onchange = e => 
		{
			var file = e.target.files[0]; 
			var reader = new FileReader();
			reader.readAsText(file,'UTF-8');

			reader.onload = readerEvent => 
			{
				var temp = [];
				var grid = [];
				file = readerEvent.target.result; // this is the content!

				for(let i = 0; i < file.length; i++)
				{
					if(file[i] == '\n') 
					{
						grid.push(temp);
						temp = [];
					}
					else if(file[i] != ',') 
					{
						temp.push(file[i])
					}
				}

				grid.forEach(x => loaded_file.push(x.map(Number)));

				load_bol = true;
			}
		};
		input.click();
	}
	else
	{
		input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv, .json'
		input.multiple = 'multiple';
		
		input.onchange = e => 
		{
			if(e.target.files.length != 2) 
			{
				alert("More or less than two files selected!\nPlease select only the map and it's qmap!"); 
				return;
			}
			else if((e.target.files[0].name.split('.')[1] == 'json' && e.target.files[1].name.split('.')[1] != 'csv') || (e.target.files[1].name.split('.')[1] == 'json' && e.target.files[0].name.split('.')[1] != 'csv') || (e.target.files[0].name.split('.')[1] == 'json' && e.target.files[1].name.split('.')[1] == 'json') || (e.target.files[0].name.split('.')[1] == 'csv' && e.target.files[1].name.split('.')[1] == 'csv'))
			{
				alert("Wrong file-format!\nPlease select a map and it's qmap!"); 
				return;
			}

			let qmap_file;
			let grid_file;

			for(let i = 0; i<e.target.files.length; i++)
			{
				if(e.target.files[i].name.split('.')[1] == 'csv')
				{
					grid_file = e.target.files[i];
				}
				else
				{
					qmap_file = e.target.files[i];
				}
			}

			var reader_grid = new FileReader();
			reader_grid.readAsText(grid_file,'UTF-8');

			var reader_qmap = new FileReader();
			reader_qmap.readAsText(qmap_file,'UTF-8');

			reader_grid.onload = readerEvent => 
			{
				var temp = [];
				var grid = [];
				file = readerEvent.target.result; // this is the content!

				for(let i = 0; i < file.length; i++)
				{
					if(file[i] == '\n') 
					{
						grid.push(temp);
						temp = [];
					}
					else if(file[i] != ',') 
					{
						temp.push(file[i])
					}
				}

				grid.forEach(x => loaded_file.push(x.map(Number)));
			}

			reader_qmap.onload = readerEvent => 
			{
				file = readerEvent.target.result; // this is the content!
				
				loaded_qmap = JSON.parse(file);

				load_ai_bol = true;
			}
		};
		input.click();
	}
}

function draw() 
{
  background(1000);

  p.html(`Discount value: ${slider1.value()}`);
  discount = slider1.value();
  p1.html(`Learn rate: ${slider2.value()}`);
  learn_rate = slider2.value();
  p2.html(`Epsilon (bigger = more exploration): ${slider3.value()}`);
  epsilon = slider3.value();
  p3.html(`Iteration (bigger = more exploration): ${slider4.value()}`);
  iterations = slider4.value();
  p4.html(`Action limit: ${slider5.value()}`);
  action_limit = slider5.value();
  p5.html(`Episode limit: ${slider6.value()}`);
  episode_limit = slider6.value();
  p6.html(`Grid size: ${slider7.value()}`);
  size = slider7.value();
  p7.html(`Min. Distance Start-Goal: ${slider8.value()}`);
  pl_goal_distance = slider8.value();

  if(load_bol) 
  {
	  for(let i = 0; i < loaded_file.length; i++)
	  {
			if(loaded_file[i].includes(2)) start_pos = [i, loaded_file[i].indexOf(2)];
			if(loaded_file[i].includes(3)) goal = [i, loaded_file[i].indexOf(3)];
	  }

	  sim = new Simulation(loaded_file.length, iterations, discount, learn_rate, epsilon, action_limit, episode_limit, pl_goal_distance, true, loaded_file, start_pos, goal);
	  load_bol = false;
  }
  else if(load_ai_bol)
  {
	for(let i = 0; i < loaded_file.length; i++)
	{
		  if(loaded_file[i].includes(2)) start_pos = [i, loaded_file[i].indexOf(2)];
		  if(loaded_file[i].includes(3)) goal = [i, loaded_file[i].indexOf(3)];
	}

	  sim = new Simulation(loaded_file.length, iterations, discount, learn_rate, epsilon, action_limit, episode_limit, pl_goal_distance, false, loaded_file, start_pos, goal, true, loaded_qmap);
	  load_ai_bol = false;
  }

  sim.execute();

  //sim.test = slider1.value();
}

/*
function custom_slider()
{
	max_value = slider.getAttribute('max');
	value = (slider.value/ max_value) * 100;

	//window.sim.test = 50;

	tooltip.innerHTML = slider.value;
	progress.style.width = value + '%';
	thumb.style.left = value + '%';
}*/

//slider.addEventListener("input", () => {custom_slider();});

/*
function keyPressed()
{
   if (keyCode === UP_ARROW) 
  {
	 sim.check_status('up');
  } 
  else if (keyCode === DOWN_ARROW) 
  {
	  sim.check_status('down');
  }
  else if (keyCode === LEFT_ARROW) 
  {
	  sim.check_status('left');
  } 
  else if (keyCode === RIGHT_ARROW) 
  {
	  sim.check_status('right');
  }
}
*/

function PQueue() 
{
    var pq = [];
    this.print = function() 
    {
      (console.log(pq));
    };
  
    this.put = function(element)
    {
        if (this.empty())
        { 
            pq.push(element);
        } 
        else 
        {
            var added = false;
            for (var i=0; i < pq.length; i++)
            {
                 if (element[1] < pq[i][1])
                 { //checking priorities
                    pq.splice(i,0,element);
                    added = true;
                    break;
                }
            }
            if (!added)
            {
                pq.push(element);
            }
        }
    };
  
    this.get = function() 
    {
        var value = pq.shift();
        return value;
    };
  
    this.head = function() 
    {
        return pq[0];
    };
  
    this.len = function() 
    {
        return pq.length; 
    };
  
    this.empty = function() 
    {
        return (pq.length === 0); 
    };
}

class Simulation
  {
    constructor(size, iterations, discount, learn_rate, epsilon, action_limit, episode_limit, pl_goal_distance, load_map, grid, start_pos, goal, load_qmap, qmap)
    {
	  this.size = size;
      //this.q_map = Array.from({ length: this.size }, () => Array(this.size).fill({'up':0,'down':0,'right':0,'left':0})); only creates copys by reference not value!!!
	  
	  this.q_map = Array.from(Array(this.size), () => new Array(this.size));
	  this.options = Array.from(Array(this.size), () => new Array(this.size));
	  this.f_val = {};
	  this.g_val = {};
	  
	  for(var i = 0; i < this.size; i++)
	  {
		  for(var j = 0; j < this.size; j++)
		  {
			  this.q_map[i][j] = {'up':0,'down':0,'right':0,'left':0};
			  this.options[i][j] = {'up':0,'down':0,'right':0,'left':0};
			  this.f_val[[i,j]] = Infinity;
			  this.g_val[[i,j]] = Infinity;
		  }
	  }
	  
	  this.pque = new PQueue(); //PriorityQueue
      this.grid_size = 450;
      this.origin = [300,100];
	  this.loaded_map = JSON.parse(JSON.stringify(grid));
	  this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));

      this.backup_grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
      this.moves= ['right', 'down', 'up', 'left'];
      this.iterations = iterations;
      this.episode = 0;
      this.discount = discount;
      this.learn_rate = learn_rate;
      this.target_reward = 100;
      this.gift_reward = 25;
      this.epsilon = epsilon;
      this.action = '';
      this.reward = {'up':0,'down':0,'right':0,'left':0};
      this.actions = 0;
      this.action_limit = action_limit;
      this.mode = '';
      this.num_walls = parseInt((this.size*this.size)/3);
      this.num_gift = 3;
      this.dist_reward = 0;
      this.distance_old = 0;
      this.dist_rew = 0;
      this.neg_reward = -100;
	  this.episode_limit = episode_limit;
	  this.pl_goal_distance = pl_goal_distance;
      this.stop = true;
	  this.run_flg = true;
	  this.goal = goal;
	  this.start = start_pos;
	  this.current = [0,0];
	  this.path = [];
	  this.ai_path = [];
	  this.copy_path = false;
	  this.check_epsiode = 35;
	  this.max_step = this.action_limit;
	  this.show_path = false;
	  this.load_map = load_map;
	  this.load_ai = load_qmap;
	  this.loaded_qmap = JSON.parse(JSON.stringify(qmap));
    }
	
	random_grid()
	{
		var idx_player = [0,0];
		var idx_goal = [0,0];
		
        for(var i = 0; i < this.num_walls; i++)
		{
            this.grid[Math.floor(Math.random() * this.size)][Math.floor(Math.random() * this.size)] = 1;
		}

        for(var j = 0; j < this.num_gift; j++)
		{
            this.grid[Math.floor(Math.random() * this.size)][Math.floor(Math.random() * this.size)] = 4;
		}

        idx_player = [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)];
        idx_goal = [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)];
        
        while(Math.sqrt((idx_player[0] - idx_goal[0])**2 + (idx_player[1] - idx_goal[1])**2) < this.pl_goal_distance)
		{
			idx_player = [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)];
			idx_goal = [Math.floor(Math.random() * this.size), Math.floor(Math.random() * this.size)];
		}

        this.grid[idx_player[0]][idx_player[1]] = 2;
        this.grid[idx_goal[0]][idx_goal[1]] = 3;
        
        this.start = [idx_player[0], idx_player[1]];
        this.goal = [idx_goal[0], idx_goal[1]];
	}
	
	init()
	{
		this.isRunning = true;
		
		/*
		this.grid = [
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 2, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 3],
        [0, 0, 0, 0, 1, 0, 0, 0, 0]];
		
		this.start = [1,1];
		this.goal = [7,8];
		this.size = 9;
		*/
		
		if(!this.load_map && !this.load_ai)
		{
			this.random_grid();
		}
		else if(this.load_ai)
		{
			this.grid = JSON.parse(JSON.stringify(this.loaded_map));
			this.q_map = JSON.parse(JSON.stringify(this.loaded_qmap))
		}
		else
		{
			this.grid = JSON.parse(JSON.stringify(this.loaded_map));
		}
		
		this.backup_grid = JSON.parse(JSON.stringify(this.grid));
		
		textSize(20);
		
		this.grid_options();
		this.a_star();
	}
	
	reset()
	{
		this.episode += 1;
        this.actions = 0;
        this.points = 0;
		this.ai_path = [];

        this.grid = JSON.parse(JSON.stringify(this.backup_grid));
	}
	
	heuristic(pnt1, pnt2)
	{
        //Manhattan distance is used!
        var dx = Math.abs(pnt1[0] - pnt2[0]);
        var dy = Math.abs(pnt1[1] - pnt2[1]);
        
        return (dx + dy)
	}
	
	grid_options()
	{
        var valide_cells = [0,2,3,4]
        for(var i = 0; i < this.grid.length; i++)
		{
            for(var j = 0; j < this.grid[i].length; j++)
			{
                if(this.grid[i][j] != 1)
				{
                    if(i != 0) //not at upper boundary
					{
                        if(i != (this.grid.length)-1) //not at lower boundary
						{
                            if(j != 0) //not at left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at right,left,upper,lower boundary
								{
                                    for(var a = 0; a < this.moves.length; a++)
									{
                                        if(this.options[i][j][this.moves[a]] != -1)
										{
                                            this.options[i][j][this.moves[a]] = 0;
										}
									}
								}
                                else //not at left,upper,lower boundary
								{
									for(var a = 0; a < this.moves.length; a++)
									{
										if(this.options[i][j][this.moves[a]] != -1)
										{
											this.options[i][j][this.moves[a]] = 0;
										}
									}
									
                                    this.options[i][j]['right'] = -1;
									
								}
							}
                            else //at left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at upper,lower boundary
								{
									for(var a = 0; a < this.moves.length; a++)
									{
										if(this.options[i][j][this.moves[a]] != -1)
										{
											this.options[i][j][this.moves[a]] = 0;
										}
									}
                                        
                                    this.options[i][j]['left'] = -1;
								}
                                else //not at upper,lower boundary
								{
                                    this.options[i][j]['up'] = 0;
                                    this.options[i][j]['down'] = 0;
                                    this.options[i][j]['left'] = -1;
                                    this.options[i][j]['right'] = -1;
								}
							}
						}
                        else //at lower boundary
						{
                            if(j != 0) //not at left boundary
							{
                                if(j != (this.grid[i])-1) //not at upper,right,left boundary
								{
                                    for(var a = 0; a < this.moves.length; a++)
									{
                                        if(this.options[i][j][this.moves[a]] != -1)
										{
                                            this.options[i][j][this.moves[a]] = 0;
										}
									}

                                        this.options[i][j]['down'] = -1;
								}
                                else //not at upper,left boundary
								{
                                    for(var a = 0; a < this.moves.length; a++)
									{
                                        if(this.options[i][j][this.moves[a]] != -1)
										{
                                            this.options[i][j][this.moves[a]] = 0;
										}
									}

                                    this.options[i][j]['right'] = -1;
                                    this.options[i][j]['down'] = -1;  
								}
							}
                            else //at left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at upper, right boundary
								{
                                    this.options[i][j]['up'] = 0;
                                    this.options[i][j]['right'] = 0;
                                    this.options[i][j]['down'] = -1;
                                    this.options[i][j]['left'] = -1;  
								}
                                else //not at upper boundary
								{
                                    this.options[i][j]['up'] = 0;
                                    this.options[i][j]['down'] = -1;
                                    this.options[i][j]['left'] = -1;
                                    this.options[i][j]['right'] = -1;
								}
							}
						}
					}
                    else //at the upper boundary
					{
                        if(i != (this.grid.length)-1) //not at the lower boundary
						{
                            if(j != 0) //not at the lower,left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at the lower,right,left boundary
								{
                                    for(var a = 0; a < this.moves.length; a++)
									{
                                        if(this.options[i][j][this.moves[a]] != -1)
										{
                                            this.options[i][j][this.moves[a]] = 0;
										}
									}

                                        this.options[i][j]['up'] = -1;
								}
                                else //not at the lower,left boundary
								{
                                    this.options[i][j]['down'] = 0;
                                    this.options[i][j]['left'] = 0;
                                    this.options[i][j]['right'] = -1;
                                    this.options[i][j]['up'] = -1;
								}
							}
                            else //at the left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at the lower,right boundary
								{
                                    this.options[i][j]['down'] = 0;
                                    this.options[i][j]['right'] = 0;
                                    this.options[i][j]['left'] = -1;
                                    this.options[i][j]['up'] = -1;  
								}
                                else //at the right boundary
								{
                                    this.options[i][j]['down'] = 0;
                                    this.options[i][j]['up'] = -1;
                                    this.options[i][j]['right'] = -1; 
                                    this.options[i][j]['left'] = -1;
								}
							}
						}
                        else //at the lower boundary
						{
                            if(j != 0) //not at the left boundary
							{
                                if(j != (this.grid[i].length)-1) //not at the left, right boundary
								{
                                    this.options[i][j]['right'] = 0; 
                                    this.options[i][j]['left'] = 0;
                                    this.options[i][j]['up'] = -1;
                                    this.options[i][j]['down'] = -1; 
								}
                                else //at the right boundary
								{
                                    this.options[i][j]['left'] = 0;
                                    this.options[i][j]['right'] = -1; 
                                    this.options[i][j]['up'] = -1;
                                    this.options[i][j]['down'] = -1;
								}
							}									
                            else //at the left boundary
							{
                                if(j != (this.grid[i].length)-1)  //not at the right bundary
                                    this.options[i][j]['right'] = 0;
                                    this.options[i][j]['left'] = -1;
                                    this.options[i][j]['up'] = -1;
                                    this.options[i][j]['down'] = -1; 
							}									
						}
					}									
				}
                else
				{
                    if(i != 0) //mark upper cell
					{
                        if(valide_cells.includes(this.grid[i-1][j]))
						{
                            this.options[i-1][j]['down'] = -1;
						}
					}	
                    if(i != (this.grid.length)-1) //mark lower cell
					{
                        if (valide_cells.includes(this.grid[i+1][j]))
						{
                            this.options[i+1][j]['up'] = -1;
						}
					}
                    if(j != 0) //mark left cell
					{
                        if(valide_cells.includes(this.grid[i][j-1]))
						{
                            this.options[i][j-1]['right'] = -1;
						}
					}
                    if(j != (this.grid[i].length)-1) //mark right cell
					{
                        if(valide_cells.includes(this.grid[i][j+1]))
						{
		                   this.options[i][j+1]['left'] = -1;
						}
					}
				}		   
			}
		}
	}
	
	a_star()
	{
		var current = [0,0];
        var nw = [0,0];
        
        this.f_val[this.start] = this.heuristic(this.start, this.goal);
        this.g_val[this.start] = 0;
        
        var g_temp = 0;
        var f_temp = 0;
        
        var temp = {};
        var path = {};
        
        this.pque.put([this.f_val[this.start], this.heuristic(this.start, this.goal), this.start]); //f_val, heuristic, position --> f_val = priotity
        
        while(!this.pque.empty())
		{
            current = this.pque.get()[2];
            
            if(current == this.goal)
			{
                break;
			}
            
            var directions = [];
			
			for(key in this.options[current[0]][current[1]])
            {
                if(this.options[current[0]][current[1]][key] === 0)
                {
                    directions.push(key);
                }
            }
            
            for(var i = 0; i < directions.length; i++)
			{
                var moves = {'up': [current[0] - 1, current[1]], 'down': [current[0] + 1, current[1]], 'right': [current[0], current[1] + 1], 'left': [current[0], current[1] - 1]};
                nw = moves[directions[i]];
                g_temp = this.g_val[current] + 1;
                f_temp = this.heuristic(nw, this.goal) + g_temp;
                
                if(f_temp < this.f_val[nw])
				{
                    this.g_val[nw] = g_temp;
                    this.f_val[nw] = f_temp;
                    this.pque.put([this.f_val[nw], this.heuristic(nw, this.goal), nw]);
                    temp[nw] = current;
				}
			}
		}
        
        var cell = this.goal
		
        while(cell != this.start)
		{
            if(!Object.keys(temp).includes(String(cell)))
			{
                console.log('a* failed!');
				location.reload();
				break;
			}
			
            path[temp[cell]] = cell;
            cell = temp[cell];
		}

		for(var i = 0; i < Object.keys(path).length; i++)
		{
			this.path.push(path[Object.keys(path).reverse()[i]]);
		}
		
		this.path.splice(0,0, this.start);
	}
	
	draw_path(path, color)
	{
        var cell_size = this.grid_size/this.size
		
		stroke(255, 153, 0);
		strokeWeight(2);
		
		//start_cell:
        //Horz
		line(this.origin[0]+(cell_size*this.start[1]), this.origin[1] + (cell_size*this.start[0]), this.origin[0] + (cell_size*this.start[1]+cell_size),  this.origin[1] + (cell_size*this.start[0]));
		line(this.origin[0]+(cell_size*this.start[1]), this.origin[1] + (cell_size*this.start[0]+cell_size), this.origin[0] + (cell_size*this.start[1]+cell_size), this.origin[1] + (cell_size*this.start[0]+cell_size));

        //Vert
		line(this.origin[0]+(cell_size*this.start[1]), this.origin[1] + (cell_size*this.start[0]), this.origin[0] + (cell_size*this.start[1]), this.origin[1] + (cell_size*this.start[0]+cell_size));
		line(this.origin[0]+(cell_size*this.start[1]+cell_size), this.origin[1] + (cell_size*this.start[0]), this.origin[0] + (cell_size*this.start[1]+cell_size), this.origin[1] + (cell_size*this.start[0]+cell_size));

		stroke(102, 0, 204);
		
        //goal_cell:
        //Horz
		line(this.origin[0]+(cell_size*this.goal[1]), this.origin[1] + (cell_size*this.goal[0]), this.origin[0] + (cell_size*this.goal[1]+cell_size), this.origin[1] + (cell_size*this.goal[0]));
		line(this.origin[0]+(cell_size*this.goal[1]), this.origin[1] + (cell_size*this.goal[0]+cell_size), this.origin[0] + (cell_size*this.goal[1]+cell_size), this.origin[1] + (cell_size*this.goal[0]+cell_size));

        //Vert
		line(this.origin[0]+(cell_size*this.goal[1]), this.origin[1] + (cell_size*this.goal[0]), this.origin[0] + (cell_size*this.goal[1]), this.origin[1] + (cell_size*this.goal[0]+cell_size));
		line(this.origin[0]+(cell_size*this.goal[1]+cell_size), this.origin[1] + (cell_size*this.goal[0]), this.origin[0] + (cell_size*this.goal[1]+cell_size), this.origin[1] + (cell_size*this.goal[0]+cell_size));
        
		if(!(path.length === 0))
		{
			for(var i = 0; i < path.length-1; i++)
			{
				stroke(color);
				strokeWeight(2);
				if(path[i][1] != path[i+1][1]) //step horizonally
				{
					line(this.origin[0]+(cell_size*path[i][1] + 0.5*cell_size), this.origin[1] + (cell_size*path[i][0] + 0.5*cell_size), this.origin[0] + (cell_size*path[i+1][1] + 0.5*cell_size),  this.origin[1] + (cell_size*path[i+1][0] + 0.5*cell_size));
				}
				else //step vertically
				{
					line(this.origin[0]+(cell_size*path[i][1] + 0.5*cell_size),this.origin[1] + (cell_size*path[i][0] + 0.5*cell_size), this.origin[0] + (cell_size*path[i+1][1] + 0.5*cell_size), this.origin[1] + (cell_size*path[i+1][0] + 0.5*cell_size));
				}
			}
		}
		
		strokeWeight(1);
		noFill();
		stroke(0);
	}
    
    check_status(command)
    {
		let visited = 5;
		if(this.actions > this.action_limit) this.reset();
			
		for(let i = 0; i < this.grid.length; i++)
		{
			if(this.grid[i].includes(2))
			{
			let idx = this.grid[i].indexOf(2);
			this.current = [i, idx];
            this.reward = JSON.parse(JSON.stringify(this.q_map[i][idx]));
			
				if(command == 'right')
				{
					if(idx != (this.grid[i].length-1) && this.grid[i][idx+1] != 1)
					{
						if(this.grid[i][idx+1] == 3)
						{
							this.ai_path.push(this.goal);
							this.ai_path.splice(0, 0, this.start);
							
							if(this.ai_path.length < this.max_step) this.max_step = this.ai_path.length;
							
							this.actions += 1;
							this.q_map[i][idx]['right'] = this.update_Q_values([i, idx+1], 3, 'right', [i, idx]);
							this.grid[i][idx] = 3;
							this.reset();
							break;
						}
						
						this.ai_path.push([i,idx+1]);
						
						this.actions += 1;
						this.q_map[i][idx]['right'] = this.update_Q_values([i, idx+1], 0, 'right', [i, idx]);
						this.grid[i][idx+1] = 2;
						this.grid[i][idx] = visited;
					}
				}
			
				else if(command == 'left')
				{
					if(idx != 0 && this.grid[i][idx-1] != 1)
					{
						if(this.grid[i][idx-1] == 3)
						{
							this.ai_path.push(this.goal);
							this.ai_path.splice(0, 0, this.start);
							
							if(this.ai_path.length < this.max_step) this.max_step = this.ai_path.length;
							
							this.actions += 1;
							this.q_map[i][idx]['left'] = JSON.parse(JSON.stringify(this.update_Q_values([i, idx-1], 3, 'left', [i, idx])));
							this.grid[i][idx] = 3;
							this.reset();
							break;
						}
						
						this.ai_path.push([i,idx-1]);
					
						this.actions += 1;
						this.q_map[i][idx]['left'] = JSON.parse(JSON.stringify(this.update_Q_values([i, idx-1], 0, 'left', [i, idx])));
						this.grid[i][idx-1] = 2;
						this.grid[i][idx] = visited;
					}
				}
			
				else if(command == 'up')
				{
					if(i != 0)
					{
						if(this.grid[i-1][idx] != 1)
						{
							if(this.grid[i-1][idx] == 3)
							{
								this.ai_path.push(this.goal);
								this.ai_path.splice(0, 0, this.start);
								
								if(this.ai_path.length < this.max_step) this.max_step = this.ai_path.length;
							
								this.actions += 1;
								this.q_map[i][idx]['up'] = JSON.parse(JSON.stringify(this.update_Q_values([i-1, idx], 3, 'up', [i, idx])));								
								this.grid[i][idx] = 3;
								this.reset();
								break;
							}
							
							this.ai_path.push([i-1,idx]);
						
							this.actions += 1;
							this.q_map[i][idx]['up'] = JSON.parse(JSON.stringify(this.update_Q_values([i-1, idx], 0, 'up', [i, idx])));
							this.grid[i-1][idx] = 2;
							this.grid[i][idx] = visited;
						}
					}
				}
			}
		}
		
        if(command == 'down')
		{
            for(let i = this.grid.length-1; i > -1; i--)
			{
                if(this.grid[i].includes(2))
				{
                    let idx = this.grid[i].indexOf(2);
                    if(i != this.grid.length-1)
					{
                        if(this.grid[i+1][idx] != 1)
						{
                            if(this.grid[i+1][idx] == 3)
							{
								this.ai_path.push(this.goal);
								this.ai_path.splice(0, 0, this.start);
								
								if(this.ai_path.length < this.max_step) this.max_step = this.ai_path.length;
								
                                this.actions += 1;
								this.q_map[i][idx]['down'] = JSON.parse(JSON.stringify(this.update_Q_values([i+1, idx], 3, 'down', [i, idx])));
                                this.grid[i][idx] = 3;
                                this.reset();
                                break;
							}
							
							this.ai_path.push([i+1,idx]);
							
                            this.actions += 1;
							this.q_map[i][idx]['down'] = JSON.parse(JSON.stringify(this.update_Q_values([i+1, idx], 0, 'down', [i, idx])));
                            this.grid[i+1][idx] = 2;
                            this.grid[i][idx] = visited;
						}
					}
				}
			}
		}
    }
	
	update_Q_values(indicies_new, cell_type, move, indicies_old)
	{
		let Q1 = 0;
		let Q2 = 0;
		let Q3 = 0;
		let q_val = 0;
		
        //Q1 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(this.target_reward+(this.discount**this.actions)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)]);
        //Q2 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(this.gift_reward+(this.discount**this.actions)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)]);
        //Q3 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(0+(this.discount**this.actions)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)]);

        //Q-Learning
		q_val = this.q_map[indicies_new[0]][indicies_new[1]]
		Q1 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(this.target_reward+this.discount*Math.max(...Object.values(this.q_map[indicies_new[0]][indicies_new[1]])));
        Q2 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(this.gift_reward+this.discount*Math.max(...Object.values(this.q_map[indicies_new[0]][indicies_new[1]])));
        Q3 = (1-this.learn_rate)*this.q_map[indicies_old[0]][indicies_old[1]][move] + this.learn_rate*(this.discount*Math.max(...Object.values(this.q_map[indicies_new[0]][indicies_new[1]])));
		
		//console.log(`Second: ${Object.values(this.q_map[indicies_new[0]][indicies_new[1]])}`);
		//console.log(`Second: ${JSON.stringify(this.q_map[7])}`);

        //MDP
        //Q1 = this.target_reward + (this.discount)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)];
        //Q2 = Q1 = this.gift_reward + (this.discount)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)];
        //Q3 = (this.discount)*this.q_map[indicies_new[0]][indicies_new[1]][max(this.q_map[indicies_new[0]][indicies_new[1]], key=this.q_map[indicies_new[0]][indicies_new[1]].get)];

        if(cell_type == 3) return (Q1);
		
        else if(cell_type == 4) return (Q2);
		
        else return (Q3);
	}
	
	learn()
	{
		let epsilon = 0;
		let p = 0;
		let q_val = 0;
		let idx = 0;
		let moves = {};
		let options = []
		
        epsilon = this.iterations/(this.episode*this.epsilon+1);

        p = (Math.random() * (1 - 0.3)) + 0.3; //np.random.uniform(0, 1); 0.3 = min, 1 = max
		moves = {'up': [this.current[0] - 1, this.current[1]], 'down': [this.current[0] + 1, this.current[1]], 'right': [this.current[0], this.current[1] + 1], 'left': [this.current[0], this.current[1] - 1]};

		if(Math.max(...Object.values(this.q_map[this.start[0]][this.start[1]])) > 20)
		{
            this.iterations = 0;
		}

        if(p < epsilon)
		{
            this.mode = 'random';
            //this.action = this.moves[Math.floor(Math.random() * this.moves.length)]; //Random item from moves array
			for(var i = 0; i < this.moves.length; i++)
			{
				if(this.path.includes(moves[this.moves[i]]))
				{
					options.push(this.moves[i]);
				}
			}
			
			if((((Math.random() * (1 - 0.9)) + 0.9) < 0.4) && !(options.length===0))
			{
				this.action = options[Math.floor(Math.random() * options.length)];
			}
			
            else
			{
                this.action = this.moves[Math.floor(Math.random() * this.moves.length)];
			}
			
		}
        else
		{
            this.mode = 'policy';
			for(let i = 0; i < this.grid.length; i++)
			{
				if(this.grid[i].includes(2))
				{
                    idx = this.grid[i].indexOf(2);
					q_val = this.q_map[i][idx];
					
					this.action = Object.keys(q_val).reduce((a, b) => q_val[a] > q_val[b] ? a : b);
				}
			}
		}
	}
    
    placeObj()
    {
      let row = 0;
      let column = 0;
      let cellBorder = 6;
      let celldimX = (this.grid_size/this.size) - (cellBorder*2);
      let celldimY = (this.grid_size/this.size) - (cellBorder*2);
	  
	  for(let row = 0; row < this.grid.length; row++)
	  {
        for(let column = 0; column < this.grid.length; column++)
		{
			let obj = this.grid[column][row];
			
			if(this.grid[column][row] == 1)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [0,0,0]);
			}
			else if(obj == 2)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [0,0,255]);
			}
			else if(obj == 3)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [0,255,0]);
			}
			else if(obj == 4)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [255,0,255]);
			}
			else if(obj == 5)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [255,255,0]);
			}
			else if(obj == 6)
			{
				this.draw_obstacle(this.origin[0] + (celldimY*row) + cellBorder + (2*row*cellBorder) + 1, this.origin[1] + (celldimX*column) + cellBorder + (2*column*cellBorder) + 1, celldimX, celldimY, [0,255,255]);
			}
		}
	  }
    }
	
	check_distance()
	{
        let idx_player = [0,0];
        let idx_goal = [0,0];
		let distance = 0;

		for(let i = 0; i < this.grid.length; i++)
		{
            if(this.grid[i].includes(2)) idx_player = [this.grid[i].indexOf(2), i];
			
            if(this.grid[i].includes(2)) idx_goal = [this.grid[i].indexOf(3), i];
			
            this.distance_old = float(this.heuristic(idx_player, idx_goal));
		}
	}
    
    draw_obstacle(x, y, size_x, size_y, color)
    {
      fill(color);
      rect(x, y, size_x, size_y);
    }
    
    draw_grid()
    {
      noFill();
      let cell_size = this.grid_size/this.size;
      
      rect(this.origin[0], this.origin[1], this.grid_size, this.grid_size);
      
      for(let i = 0; i < this.size; i++)
      {
        line(this.origin[0] + cell_size * i, this.origin[1], this.origin[0] + cell_size * i, this.grid_size + this.origin[1]);
        
        line(this.origin[0], this.origin[1] + cell_size*i, this.origin[0] + this.grid_size, this.origin[1] + cell_size*i);
      }
    }
	
	draw_text(x, y, txt)
	{
		fill(0);
		text(txt, x, y);
	}
	
	execute()
	{
		if(this.run_flg)
		{
			this.run_flg = false;
			this.init();
		}
		
		if(this.isRunning)
		{
			if(this.episode > this.episode_limit)
			{
				this.actions = 0;
				this.points = 0;
				this.grid = JSON.parse(JSON.stringify(this.backup_grid));
				this.stop = true;
				this.action = '';
			}
			
			this.draw_grid();
			this.placeObj();
			if(this.show_path) this.draw_path(this.path, [50,100,50]);
			this.check_status(this.action);
			this.check_distance();
			
			if(!this.stop) this.learn();
			
            if(this.episode === this.check_epsiode)
			{
                this.copy_path = true;
			}
            else
			{
                this.copy_path = false;
			}
			
			if(this.episode > this.check_epsiode) this.draw_path(this.ai_path, 'rgba(100,0,0,0.1)');
			
			this.draw_text(10, 25, `Episodes: ${this.episode}`);
			this.draw_text(10, 50, `Actions: ${this.actions}`);
			this.draw_text(10, 75, `Action: ${this.action}`);
			this.draw_text(200, 25, `Reward: up: ${Math.round(this.reward['up'])}, down: ${Math.round(this.reward['down'])}, right: ${Math.round(this.reward['right'])}, left: ${Math.round(this.reward['left'])}`);
			this.draw_text(10, 125, `Mode: ${this.mode}`);
			this.draw_text(10, 100, `Distance: ${this.distance_old.toFixed()}`);	
			this.draw_text(10, 150, `Steps a*: ${this.path.length}`);
			this.draw_text(10, 175, `Steps ai: ${this.max_step}`);
		}
	}
  }